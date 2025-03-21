"use strict";
require('dotenv').config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Récupère une variable d'environnement et retourne une erreur si elle n'est pas définie.
function getEnvVariable(key) {
    const value = process.env[key];
    if (!value) {
        console.error(`FATAL ERROR: La variable d'environnement ${key} n'est pas définie.`);
        process.exit(1);
    }
    return value;
}
exports.config = {
    jwtSecret: getEnvVariable("JWT_SECRET"),
    port: process.env.PORT || 3000,
    db_port: process.env.DB_PORT || 5432,
    db_host: getEnvVariable("DB_HOST"),
    db_user: getEnvVariable("DB_USER"),
    db_password: getEnvVariable("DB_PASSWORD"),
    db_name: getEnvVariable("DB_NAME"),
};
