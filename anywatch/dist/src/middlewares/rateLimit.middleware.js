"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const createRateLimiter = (windowMs, max) => {
    return (0, express_rate_limit_1.default)({
        windowMs, // Période en millisecondes
        max, // Nombre maximal de requêtes autorisées dans la fenêtre
        message: "Trop de demandes pour cette IP, veuillez réessayer plus tard.",
        standardHeaders: true, // Retourne les informations dans les headers `RateLimit-*`
        legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    });
};
exports.createRateLimiter = createRateLimiter;
