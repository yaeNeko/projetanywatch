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
