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
exports.isWatchlistOwner = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticateToken = (req, res, next) => {
    // Le token JWT est attendu dans l'en-tête Authorization sous la forme "Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Accès refusé : token JWT manquant." });
        return;
    }
    jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Accès refusé : token invalide." });
            return;
        }
        if (typeof decoded === "string" || !decoded || !("id" in decoded)) {
            res.status(403).json({ message: "Accès refusé : payload de token invalide." });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Middleware pour vérifier si l'utilisateur est propriétaire de la watchlist
const isWatchlistOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const result = yield client.query("SELECT * FROM watchlists WHERE id = $1 AND utilisateur_id = $2", [watchlistId, userId]);
        if (result.rowCount === 0) {
            res.status(403).json({
                message: "Accès refusé : vous n'êtes pas propriétaire de cette watchlist"
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Erreur de vérification de propriété de watchlist:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.isWatchlistOwner = isWatchlistOwner;
