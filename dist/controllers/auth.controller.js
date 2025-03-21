import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/env';
import db from '../config/db';

const JWT_SECRET = config.jwtSecret;

// Vérifier que JWT_SECRET est bien défini
if (!JWT_SECRET) {
  throw new Error('La variable d\'environnement JWT_SECRET n\'est pas définie');
}

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Vérification que tous les champs sont renseignés
    if (username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    // Vérification de la force du mot de passe (facultatif)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères, incluant des lettres et des chiffres." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: "Cet utilisateur existe déjà." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion de l'utilisateur dans la base
    const result = await db.query("INSERT INTO utilisateurs (pseudo, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING id, pseudo, email", [username, email, hashedPassword]);
    const newUser = result.rows[0];

    res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur lors de l’inscription. Veuillez réessayer." });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier que les champs sont renseignés
    if (email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    // Récupérer l'utilisateur depuis la base de données
    const result = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }

    const user = result.rows[0];

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }

    // Génération du token JWT
    const token = jsonwebtoken.sign({ id: user.id, email: user.email, username: user.pseudo }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur lors de la connexion. Veuillez réessayer plus tard." });
  }
};
