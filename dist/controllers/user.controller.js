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
exports.getUserProfile = void 0;
const db_1 = __importDefault(require("../config/db")); // Connexion à la base de données
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête
    try {
        // Requête SQL pour récupérer les informations de l'utilisateur
        const result = yield db_1.default.query('SELECT id, pseudo, email FROM utilisateurs WHERE id = $1', [userId]);
        // Si l'utilisateur n'existe pas
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        // On renvoie les informations sans le mot de passe
        const user = result.rows[0];
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
exports.getUserProfile = getUserProfile;
