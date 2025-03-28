"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_connection_string_1 = require("pg-connection-string");
dotenv_1.default.config();
// Fonction pour récupérer une variable d'environnement et s'assurer qu'elle est définie
function getEnvVariable(key) {
    const value = process.env[key];
    if (!value) {
        console.error(`❌ ERREUR: La variable d'environnement ${key} n'est pas définie.`);
        process.exit(1);
    }
    return value;
}
const dbConfig = (0, pg_connection_string_1.parse)(getEnvVariable("DATABASE_URL"));
exports.config = {
    jwtSecret: getEnvVariable("JWT_SECRET"),
    port: process.env.PORT || 3000,
    db_host: dbConfig.host,
    db_port: dbConfig.port,
    db_user: dbConfig.user,
    db_password: dbConfig.password,
    db_name: dbConfig.database,
    database_url: getEnvVariable("DATABASE_URL"),
};
