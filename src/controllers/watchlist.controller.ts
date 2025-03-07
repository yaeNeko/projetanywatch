
import { Request, Response } from "express";
import client from "../config/db";

export const getWatchlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const utilisateur_id = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres

  try {
    
    const result = await client.query(
      `
      SELECT
      w.id AS watchlist_id,
      w.nom AS watchlist_name,
      sa.id AS serie_anime_id,
      sa.nom AS serie_anime_name,
      sa.type AS serie_anime_type
      FROM
      watchlists w
      JOIN
      watchlist_ajouts wa ON w.utilisateur_id = wa.utilisateur_id  -- Jointure correcte via utilisateur_id
      JOIN
      series_animes sa ON wa.serie_anime_id = sa.id
      WHERE
      w.utilisateur_id = $1;  -- ID de l'utilisateur

        `,
      [utilisateur_id]
    );

    // Vérifie si la requête a renvoyé des résultats
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Aucune watchlist trouvée" });
      return;
    }

    // Renvoie les résultats au format JSON
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération de la watchlist:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer toutes les watchlists d'un utilisateur

export const getAllWatchlists = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId;

  try {
    const result = await client.query(
      `SELECT * FROM watchlists WHERE utilisateur_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ message: "Aucune watchlist trouvée pour cet utilisateur" });
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des watchlists:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les séries d'une watchlist spécifique

export const getSeriesInWatchlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const watchlistId = req.params.watchlistId; // ID de la watchlist

  try {
    const result = await client.query(
      `SELECT
  w.id AS watchlist_id,
  w.nom AS watchlist_name,
  sa.id AS serie_anime_id,
  sa.nom AS serie_anime_name,
  sa.type AS serie_anime_type
FROM
  watchlists w
JOIN
  watchlist_ajouts wa ON w.utilisateur_id = wa.utilisateur_id
JOIN
  series_animes sa ON wa.serie_anime_id = sa.id
WHERE
  w.id = $1;  -- On filtre sur l'ID de la watchlist
`,
      [watchlistId]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ message: "Aucune série trouvée dans cette watchlist" });
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des séries de la watchlist:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//Récuperer les 5 series les plus ajoutées aux watchlists

export const getTopSeries = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Route /api/watchlist/series/top atteinte"); 
  try {
    const result = await client.query(
      `SELECT
         sa.id AS serie_anime_id,
         sa.nom AS serie_anime_name,
         sa.type AS serie_anime_type,
         COUNT(wa.serie_anime_id) AS ajout_count
      FROM
         watchlist_ajouts wa
      JOIN
         series_animes sa ON wa.serie_anime_id = sa.id
      GROUP BY
         sa.id
      ORDER BY
         ajout_count DESC
      LIMIT 5;`
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Aucune série trouvée" });
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des séries:", error);
    res.status(500).json({ message: "Erreur serveur" });

  }
};


// Mise à jour du statut d'une série/animé dans la watchlist
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { watchlistId, serieAnimeId } = req.params;  // Récupère les paramètres d'URL : watchlistId et serieAnimeId
  const { statut } = req.body; // Récupère le nouveau statut passé dans le corps de la requête

  try {
    // Vérifie si la série/animé existe dans la watchlist pour l'utilisateur
    const result = await client.query(
      'SELECT * FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2',
      [watchlistId, serieAnimeId]
    );

    // Si la série/animé n'existe pas dans la watchlist, retourne une erreur 404 et arrête l'exécution
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Série/animé non trouvé dans la watchlist' });
      return; // Arrêter l'exécution après avoir envoyé la réponse
    }

    // Si la série/animé est trouvé dans la watchlist, on procède à la mise à jour de son statut
    const updateResult = await client.query(
      'UPDATE watchlist_items SET statut = $1 WHERE watchlist_id = $2 AND serie_anime_id = $3 RETURNING *',
      [statut, watchlistId, serieAnimeId]
    );

    // Si l'update n'a pas été effectué correctement, retourne une erreur 400 et arrête l'exécution
    if (updateResult.rowCount === 0) {
      res.status(400).json({ message: 'Impossible de mettre à jour le statut' });
      return; // Arrêter l'exécution après avoir envoyé la réponse
    }

    // Si tout se passe bien, retourne le statut mis à jour
    res.status(200).json({
      message: 'Statut mis à jour avec succès',
      updatedStatus: updateResult.rows[0], // Retourne la ligne mise à jour
    });
    return; // Arrêter l'exécution après avoir envoyé la réponse
  } catch (error) {
    // Si une erreur serveur se produit, retourne une erreur 500 et arrête l'exécution
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
    return; // Arrêter l'exécution après avoir envoyé la réponse
  
  }
};


// Supprimer une série/animé de sa watchlist
export const removeFromWatchlist = async (req: Request, res: Response): Promise<void> => {
    const { watchlistId, serieAnimeId } = req.params;

    try {
        // Vérifier si l'élément existe dans la watchlist
        const checkExist = await client.query(
            'SELECT * FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2',
            [watchlistId, serieAnimeId]
        );

        if (checkExist.rowCount === 0) {
            res.status(404).json({ message: 'Série/animé non trouvé dans la watchlist' });
            return;
        }

        // Supprimer l'élément
        await client.query(
            'DELETE FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2',
            [watchlistId, serieAnimeId]
        );

        res.status(200).json({ message: 'Série/animé retiré de la watchlist avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la watchlist :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
