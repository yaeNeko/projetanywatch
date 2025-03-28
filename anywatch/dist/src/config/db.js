"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Vérification si DATABASE_URL est bien définie
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL n'est pas définie !");
    process.exit(1);
}
// Configuration avancée pour accepter SSL même avec un certificat auto-signé
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Ignore l'erreur de certificat auto-signé
    },
});
// Connexion à PostgreSQL
client
    .connect()
    .then(() => console.log("✅ Connecté à PostgreSQL"))
    .catch((err) => console.error("❌ Erreur de connexion PostgreSQL", err));
// Exporter le client pour l'utiliser ailleurs
exports.default = client;
