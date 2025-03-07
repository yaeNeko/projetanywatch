import { Request, Response, NextFunction } from "express";
import client from "../config/db";

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// Récupération de l'utilisateur connecté depuis req.user (middleware d'auth)
	const user_id = req.user?.id;
	if (!user_id) {
		res.status(401).json({ message: "Utilisateur non authentifié." });
		return;
	}

	// Données envoyées dans le body
	const { serie_anime_id, note, commentaire, pseudo_anonyme, type } = req.body;

	// Vérifications de base sur les données
	if (!serie_anime_id || isNaN(Number(serie_anime_id))) {
		res.status(400).json({ message: "serie_anime_id est requis et doit être un nombre valide." });
		return;
	}

	if (note == null || ![1, 2, 3, 4, 5].includes(Number(note))) {
		res.status(400).json({ message: "La note est requise et doit être 1, 2, 3, 4 ou 5." });
		return;
	}

	// Vérifier que la série/animé existe bien dans la table series_animes
	try {
		const seriesAnimeQuery = await client.query("SELECT id FROM series_animes WHERE id = $1", [serie_anime_id]);
		if (seriesAnimeQuery.rowCount === 0) {
			res.status(404).json({ message: "La série/animé spécifiée n'existe pas." });
			return;
		}
	} catch (error) {
		console.error("Erreur lors de la vérification de l'existence de la série/animé:", error);
		res.status(500).json({ message: "Erreur serveur lors de la vérification de l'existence de la série/animé." });
		return;
	}

	try {
		const query = `
            INSERT INTO avis (utilisateur_id, serie_anime_id, note, commentaire, pseudo_anonyme, type)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, utilisateur_id, serie_anime_id, note, commentaire, pseudo_anonyme, date_creation, type
        `;
		const values = [user_id, serie_anime_id, note, commentaire, pseudo_anonyme || false, type];
		const result = await client.query(query, values);

		res.status(201).json({
			message: "Avis ajouté avec succès.",
			review: result.rows[0],
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout de l'avis:", error);
		res.status(500).json({ message: "Erreur serveur lors de l'ajout de l'avis." });
	}
};

// Fonction pour récupérer les avis d'une série ou d'un animé
export const getReviewsForSerieAnime = async (req: Request, res: Response): Promise<void> => {
	const { serie_anime_id } = req.params; // Récupère l'ID de la série/animé depuis les paramètres de la requête
  
	try {
	  // Requête SQL pour récupérer les avis associés à l'ID de la série/animé
	  const result = await client.query(
		`SELECT
		   r.id,
		   r.utilisateur_id,
		   r.serie_anime_id,
		   r.note,
		   r.commentaire,
		   r.pseudo_anonyme,
		   r.date_creation,
		   sa.type,
		   u.pseudo AS utilisateur_pseudo
		FROM
		   avis r
		JOIN
		   series_animes sa ON r.serie_anime_id = sa.id
		LEFT JOIN
		   utilisateurs u ON r.utilisateur_id = u.id
		WHERE
		   r.serie_anime_id = $1
		ORDER BY
		   r.date_creation DESC;`,
		[serie_anime_id]
	  );
  
	  if (result.rows.length === 0) {
		res.status(404).json({ message: "Aucun avis trouvé pour cette série/animé." });
		return;
	  }
  
	  res.status(200).json(result.rows);
	} catch (error) {
	  console.error("Erreur lors de la récupération des avis:", error);
	  res.status(500).json({ message: "Erreur serveur" });
	}
  };
