import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

const JWT_SECRET = config.jwtSecret;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.sendStatus(401);
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}

		req.user = user;
		next();
	});
};
