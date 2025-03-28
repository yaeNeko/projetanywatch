import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
	// Le token JWT est attendu dans l'en-tête Authorization sous la forme "Bearer <token>"
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Accès refusé : token JWT manquant." });
		return;
	}

	jwt.verify(token, config.jwtSecret, (err, decoded) => {
		if (err) {
			res.status(403).json({ message: "Accès refusé : token invalide." });
			return;
		}

		if (typeof decoded === "string" || !decoded || !("id" in decoded)) {
			res.status(403).json({ message: "Accès refusé : payload de token invalide." });
			return;
		}

		req.user = decoded as { id: number };
		next();
	});
};

// Middleware pour vérifier si l'utilisateur est propriétaire de la watchlist
export const isWatchlistOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.user?.id;
		const watchlistId = req.params.watchlistId || req.params.id;

		if (!userId) {
			res.status(403).json({ message: "Utilisateur non authentifié" });
			return;
		}

		if (!watchlistId) {
			res.status(400).json({ message: "ID de watchlist non fourni" });
			return;
		}

		// Importer client depuis la config de DB
		const client = require("../config/db").default;
		
		// Vérifier si l'utilisateur est propriétaire de la watchlist
		const result = await client.query(
			"SELECT * FROM watchlists WHERE id = $1 AND utilisateur_id = $2",
			[watchlistId, userId]
		);

		if (result.rowCount === 0) {
			res.status(403).json({ 
				message: "Accès refusé : vous n'êtes pas propriétaire de cette watchlist" 
			});
			return;
		}

		next();
	} catch (error) {
		console.error("Erreur de vérification de propriété de watchlist:", error);
		res.status(500).json({ message: "Erreur serveur" });
	}
};
