import { Request, Response } from "express";
import client from "../config/db";

export const getWatchlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const utilisateur_id = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres

  try {
    // Requête SQL pour récupérer les séries et animés associés à la watchlist de l'utilisateur
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
  console.log("Route /api/watchlist/series/top atteinte"); // Vérifie que la route est bien appelée
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
