import { Request, Response } from "express";
import client from "../config/db"; // Connexion à PostgreSQL

// Récupérer toutes les offres d'abonnement
export const getSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await client.query(
      `SELECT 
          id,
          nom,
          prix,
          utilisateur_id,
          date_debut,
          date_expiration,
          actif,
          accesillimitewatchlist,
          accesillimitecommentaires,
          limite_watchlist
       FROM abonnements;`
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Aucune offre d'abonnement trouvée" });
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des offres d'abonnement:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
