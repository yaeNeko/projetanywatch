import { Request, Response } from "express";
import client from "../config/db"; // Connexion à la base de données

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.id; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête

	try {
		// Requête SQL pour récupérer les informations de l'utilisateur
		const result = await client.query("SELECT id, pseudo, email FROM utilisateurs WHERE id = $1", [userId]);

		// Si l'utilisateur n'existe pas
		if (result.rowCount === 0) {
			res.status(404).json({ message: "Utilisateur non trouvé" });
			return;
		}

		// On renvoie les informations sans le mot de passe
		const user = result.rows[0];
		res.status(200).json(user);
	} catch (error) {
		console.error("Erreur lors de la récupération du profil utilisateur:", error);
		res.status(500).json({ message: "Erreur serveur" });
	}
};
