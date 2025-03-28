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
exports.deleteWatchlist = exports.removeFromWatchlist = exports.updateStatus = exports.getTopSeries = exports.getSeriesInWatchlist = exports.getAllWatchlists = exports.getWatchlist = exports.addToWatchlist = exports.createWatchlist = void 0;
const db_1 = __importDefault(require("../config/db"));
// Créer une nouvelle watchlist
const createWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { nom } = req.body;
    // Utilise l'ID de l'utilisateur authentifié au lieu de celui fourni dans le corps de la requête
    const utilisateur_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!utilisateur_id) {
        res.status(401).json({ message: "Utilisateur non authentifié." });
        return;
    }
    if (!nom || !nom.trim()) {
        res.status(400).json({ message: "Le nom de la watchlist est obligatoire." });
        return;
    }
    try {
        const result = yield db_1.default.query("INSERT INTO watchlists (utilisateur_id, nom) VALUES ($1, $2) RETURNING *", [utilisateur_id, nom]);
        res.status(201).json({
            message: "Watchlist créée avec succès",
            watchlist: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur lors de la création de la watchlist:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.createWatchlist = createWatchlist;
// Ajouter une série/animé à une watchlist
const addToWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { watchlistId, serieAnimeId } = req.params;
    const { statut } = req.body; // Optionnel: statut initial (à voir, non vu, etc.)
    if (!watchlistId || !serieAnimeId) {
        res.status(400).json({ message: "L'id de la watchlist et de la série/animé sont obligatoires" });
        return;
    }
    try {
        // Vérifier si la watchlist existe
        const watchlistExists = yield db_1.default.query("SELECT * FROM watchlists WHERE id = $1", [watchlistId]);
        if (watchlistExists.rowCount === 0) {
            res.status(404).json({ message: "Watchlist non trouvée" });
            return;
        }
        // Vérifier si la série/animé existe
        const serieExists = yield db_1.default.query("SELECT * FROM series_animes WHERE id = $1", [serieAnimeId]);
        if (serieExists.rowCount === 0) {
            res.status(404).json({ message: "Série/animé non trouvé" });
            return;
        }
        // Vérifier si la série/animé existe déjà dans la watchlist
        const checkExist = yield db_1.default.query("SELECT * FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2", [watchlistId, serieAnimeId]);
        if (checkExist.rowCount && checkExist.rowCount > 0) {
            res.status(400).json({ message: "Cette série/animé est déjà dans la watchlist" });
            return;
        }
        // Ajouter la série/animé à la watchlist avec statut par défaut "non vu" (1)
        const result = yield db_1.default.query("INSERT INTO watchlist_items (watchlist_id, serie_anime_id, statut) VALUES ($1, $2, $3) RETURNING *", [watchlistId, serieAnimeId, statut || 1]);
        res.status(201).json({
            message: "Série/animé ajouté à la watchlist avec succès",
            item: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur lors de l'ajout à la watchlist:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.addToWatchlist = addToWatchlist;
const getWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const utilisateur_id = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres
    try {
        const result = yield db_1.default.query(`
      SELECT
      w.id AS watchlist_id,
      w.nom AS watchlist_name,
      sa.id AS serie_anime_id,
      sa.nom AS serie_anime_name,
      sa.type AS serie_anime_type
      FROM
      watchlists w
      JOIN
      watchlist_ajouts wa ON w.utilisateur_id = wa.utilisateur_id  -- Jointure correcte via utilisateur_id
      JOIN
      series_animes sa ON wa.serie_anime_id = sa.id
      WHERE
      w.utilisateur_id = $1;  -- ID de l'utilisateur

        `, [utilisateur_id]);
        // Vérifie si la requête a renvoyé des résultats
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Aucune watchlist trouvée" });
            return;
        }
        // Renvoie les résultats au format JSON
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erreur lors de la récupération de la watchlist:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.getWatchlist = getWatchlist;
// Récupérer toutes les watchlists d'un utilisateur
const getAllWatchlists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Utilise l'ID dans les paramètres pour permettre à l'admin de voir les watchlists d'autres utilisateurs 
    // ou l'ID de l'utilisateur authentifié si l'ID dans les paramètres est "me"
    let userId = req.params.userId;
    const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Si l'utilisateur demande ses propres watchlists
    if (userId === "me" && authenticatedUserId) {
        userId = authenticatedUserId.toString();
    }
    // Vérifie si l'utilisateur authentifié a le droit de voir les watchlists demandées
    // Un utilisateur peut voir ses propres watchlists
    if ((authenticatedUserId === null || authenticatedUserId === void 0 ? void 0 : authenticatedUserId.toString()) !== userId) {
        // Ici on pourrait ajouter une vérification pour les admins
        // par exemple: if (!isAdmin(authenticatedUserId)) {
        res.status(403).json({ message: "Vous n'avez pas accès aux watchlists de cet utilisateur" });
        return;
    }
    try {
        const result = yield db_1.default.query(`SELECT * FROM watchlists WHERE utilisateur_id = $1`, [userId]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Aucune watchlist trouvée pour cet utilisateur" });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des watchlists:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.getAllWatchlists = getAllWatchlists;
// Récupérer les séries d'une watchlist spécifique
const getSeriesInWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const watchlistId = req.params.watchlistId; // ID de la watchlist
    try {
        const result = yield db_1.default.query(`SELECT
  w.id AS watchlist_id,
  w.nom AS watchlist_name,
  sa.id AS serie_anime_id,
  sa.nom AS serie_anime_name,
  sa.type AS serie_anime_type
FROM
  watchlists w
JOIN
  watchlist_ajouts wa ON w.utilisateur_id = wa.utilisateur_id
JOIN
  series_animes sa ON wa.serie_anime_id = sa.id
WHERE
  w.id = $1;  -- On filtre sur l'ID de la watchlist
`, [watchlistId]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Aucune série trouvée dans cette watchlist" });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des séries de la watchlist:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.getSeriesInWatchlist = getSeriesInWatchlist;
// Récuperer les 5 series les plus ajoutées aux watchlists
const getTopSeries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Route /api/watchlist/series/top atteinte");
    try {
        const result = yield db_1.default.query(`SELECT
         sa.id AS serie_anime_id,
         sa.nom AS serie_anime_name,
         sa.type AS serie_anime_type,
         COUNT(wa.serie_anime_id) AS ajout_count
      FROM
         watchlist_ajouts wa
      JOIN
         series_animes sa ON wa.serie_anime_id = sa.id
      GROUP BY
         sa.id
      ORDER BY
         ajout_count DESC
      LIMIT 5;`);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Aucune série trouvée" });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des séries:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.getTopSeries = getTopSeries;
// Mise à jour du statut d'une série/animé dans la watchlist
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { watchlistId, serieAnimeId } = req.params; // Récupère les paramètres d'URL : watchlistId et serieAnimeId
    const { statut } = req.body; // Récupère le nouveau statut passé dans le corps de la requête
    if (!statut) {
        res.status(400).json({ message: "Le statut est obligatoire" });
        return;
    }
    try {
        // Vérifie si la série/animé existe dans la watchlist pour l'utilisateur
        const result = yield db_1.default.query("SELECT * FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2", [watchlistId, serieAnimeId]);
        // Si la série/animé n'existe pas dans la watchlist, retourne une erreur 404 et arrête l'exécution
        if (result.rowCount === 0) {
            res.status(404).json({ message: "Série/animé non trouvé dans la watchlist" });
            return;
        }
        // Si la série/animé est trouvé dans la watchlist, on procède à la mise à jour de son statut
        const updateResult = yield db_1.default.query("UPDATE watchlist_items SET statut = $1 WHERE watchlist_id = $2 AND serie_anime_id = $3 RETURNING *", [statut, watchlistId, serieAnimeId]);
        // Si l'update n'a pas été effectué correctement, retourne une erreur 400
        if (updateResult.rowCount === 0) {
            res.status(400).json({ message: "Impossible de mettre à jour le statut" });
            return;
        }
        // Si tout se passe bien, retourne le statut mis à jour
        res.status(200).json({
            message: "Statut mis à jour avec succès",
            updatedStatus: updateResult.rows[0], // Retourne la ligne mise à jour
        });
    }
    catch (error) {
        // Si une erreur serveur se produit, retourne une erreur 500
        console.error("Erreur lors de la mise à jour du statut:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.updateStatus = updateStatus;
// Supprimer une série/animé de sa watchlist
const removeFromWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { watchlistId, serieAnimeId } = req.params;
    try {
        // Vérifier si l'élément existe dans la watchlist
        const checkExist = yield db_1.default.query("SELECT * FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2", [watchlistId, serieAnimeId]);
        if (checkExist.rowCount === 0) {
            res.status(404).json({ message: "Série/animé non trouvé dans la watchlist" });
            return;
        }
        // Supprimer l'élément
        yield db_1.default.query("DELETE FROM watchlist_items WHERE watchlist_id = $1 AND serie_anime_id = $2", [watchlistId, serieAnimeId]);
        res.status(200).json({ message: "Série/animé retiré de la watchlist avec succès" });
    }
    catch (error) {
        console.error("Erreur lors de la suppression de la série/animé :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.removeFromWatchlist = removeFromWatchlist;
// Supprimer une watchlist
const deleteWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const watchlistId = Number(req.params.watchlistId);
    const forceDelete = req.params.forceDelete === "true";
    if (!watchlistId) {
        res.status(400).json({ message: "L'id de la watchlist à supprimer est obligatoire." });
        return;
    }
    try {
        // Vérifier si la watchlist existe
        const watchlistCheck = yield db_1.default.query("SELECT * FROM watchlists WHERE id = $1", [watchlistId]);
        if (watchlistCheck.rowCount === 0) {
            res.status(404).json({ message: "Watchlist non trouvée" });
            return;
        }
        // Si forceDelete n'est pas true, vérifier si la watchlist contient des éléments
        if (forceDelete !== true) {
            const itemsCheck = yield db_1.default.query("SELECT COUNT(*) FROM watchlist_items WHERE watchlist_id = $1", [watchlistId]);
            if (parseInt(itemsCheck.rows[0].count) > 0) {
                res.status(400).json({
                    message: "La watchlist contient des éléments. Utilisez forceDelete=true pour supprimer la watchlist et tous ses éléments.",
                    hasItems: true,
                    itemCount: parseInt(itemsCheck.rows[0].count),
                });
                return;
            }
        }
        // Supprimer d'abord les éléments de la watchlist si nécessaire
        yield db_1.default.query("DELETE FROM watchlist_items WHERE watchlist_id = $1", [watchlistId]);
        // Supprimer la watchlist
        yield db_1.default.query("DELETE FROM watchlists WHERE id = $1", [watchlistId]);
        res.status(200).json({ message: "Watchlist supprimée avec succès." });
    }
    catch (error) {
        console.error("Erreur lors de la suppression de la watchlist :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.deleteWatchlist = deleteWatchlist;
