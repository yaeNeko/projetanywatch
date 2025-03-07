import e, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/env";
import client from "../config/db";

const JWT_SECRET = config.jwtSecret;

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { username, email, password } = req.body;

		// Vérification que tous les champs sont renseignés
		if (username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
			res.status(400).json({ error: "Tous les champs sont obligatoires." });
			return;
		}

		// Vérifier si l'utilisateur existe déjà dans la base de données
		const existingUser = await client.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
		if (existingUser.rowCount && existingUser.rowCount > 0) {
			res.status(400).json({ error: "Cet utilisateur existe déjà." });
			return;
		}

		// Hash du mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insertion de l'utilisateur dans la base et récupération de ses infos
		const result = await client.query("INSERT INTO utilisateurs (pseudo, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING id, pseudo, email", [username, email, hashedPassword]);

		const newUser = result.rows[0];
		res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
	} catch (error) {
		console.error("Erreur lors de l'inscription :", error);
		res.status(500).json({ error: "Erreur lors de l’inscription. Veuillez réessayer." });
	}
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { email, password } = req.body;

		// Vérifier que les champs sont renseignés
		if (email.trim().length === 0 || password.trim().length === 0) {
			res.status(400).json({ error: "Tous les champs sont obligatoires." });
			return;
		}

		// Récupération de l'utilisateur depuis la base de données
		const result = await client.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
		if (result.rowCount === 0) {
			res.status(400).json({ error: "Email ou mot de passe incorrect." });
			return;
		}

		const user = result.rows[0];

		// Vérification du mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
		if (!isPasswordValid) {
			res.status(400).json({ error: "Email ou mot de passe incorrect." });
			return;
		}

		// Génération du token JWT
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		console.error("Erreur lors de la connexion :", error);
		res.status(500).json({ error: "Erreur lors de la connexion." });
	}
};
