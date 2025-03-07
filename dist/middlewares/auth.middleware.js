"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
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
