"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = env_1.config.jwtSecret;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Vérification que tous les champs sont renseignés
        if (!username ||
            username.trim().length === 0 ||
            !email ||
            email.trim().length === 0 ||
            !password ||
            password.trim().length === 0) {
            res.status(400).json({ error: "Tous les champs sont obligatoires." });
            return;
        }
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existingUser = yield db_1.default.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
        if (existingUser &&
            existingUser.rowCount !== null &&
            existingUser.rowCount > 0) {
            res.status(400).json({ error: "Cet utilisateur existe déjà." });
            return;
        }
        // Hash du mot de passe
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insertion de l'utilisateur dans la base et récupération de ses infos
        const result = yield db_1.default.query("INSERT INTO utilisateurs (pseudo, email, mot_de_passe, est_public) VALUES ($1, $2, $3, $4) RETURNING id, pseudo, email", [username, email, hashedPassword, true] // ou false si nécessaire
        );
        const newUser = result.rows[0];
        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            user: {
                id: newUser.id,
                pseudo: newUser.pseudo,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res
            .status(500)
            .json({ error: "Erreur lors de l’inscription. Veuillez réessayer." });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Vérifier que les champs sont renseignés
        if (email.trim().length === 0 || password.trim().length === 0) {
            res.status(400).json({ error: "Tous les champs sont obligatoires." });
            return;
        }
        // Récupération de l'utilisateur depuis la base de données
        const result = yield db_1.default.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
        if (result.rowCount === 0) {
            res.status(400).json({ error: "Email ou mot de passe incorrect." });
            return;
        }
        const user = result.rows[0];
        // Vérification du mot de passe
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.mot_de_passe);
        if (!isPasswordValid) {
            res.status(400).json({ error: "Email ou mot de passe incorrect." });
            return;
        }
        // Génération du token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
    catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
});
exports.login = login;
