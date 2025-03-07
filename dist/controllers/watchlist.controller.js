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
exports.updateStatus = void 0;
const db_1 = __importDefault(require("../config/db")); // Connexion à la base de données
// Mise à jour du statut d'une série/animé dans la watchlist
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { watchlistId, serieAnimeId } = req.params; // Récupère les paramètres d'URL : watchlistId et serieAnimeId
    const { statut } = req.body; // Récupère le nouveau statut passé dans le corps de la requête
    try {
        // Vérifie si la série/animé existe dans la watchlist pour l'utilisateur
        const result = yield db_1.default.query('SELECT * FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2', [watchlistId, serieAnimeId]);
        // Si la série/animé n'existe pas dans la watchlist, retourne une erreur 404 et arrête l'exécution
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Série/animé non trouvé dans la watchlist' });
            return; // Arrêter l'exécution après avoir envoyé la réponse
        }
        // Si la série/animé est trouvé dans la watchlist, on procède à la mise à jour de son statut
        const updateResult = yield db_1.default.query('UPDATE watchlist_items SET statut = $1 WHERE watchlist_id = $2 AND serie_anime_id = $3 RETURNING *', [statut, watchlistId, serieAnimeId]);
        // Si l'update n'a pas été effectué correctement, retourne une erreur 400 et arrête l'exécution
        if (updateResult.rowCount === 0) {
            res.status(400).json({ message: 'Impossible de mettre à jour le statut' });
            return; // Arrêter l'exécution après avoir envoyé la réponse
        }
        // Si tout se passe bien, retourne le statut mis à jour
        res.status(200).json({
            message: 'Statut mis à jour avec succès',
            updatedStatus: updateResult.rows[0], // Retourne la ligne mise à jour
        });
        return; // Arrêter l'exécution après avoir envoyé la réponse
    }
    catch (error) {
        // Si une erreur serveur se produit, retourne une erreur 500 et arrête l'exécution
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur serveur' });
        return; // Arrêter l'exécution après avoir envoyé la réponse
    }
});
exports.updateStatus = updateStatus;
