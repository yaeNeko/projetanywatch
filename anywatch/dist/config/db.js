"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Configuration de la connexion à la base de données
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL, // Assure-toi que cette variable d'environnement est définie
});
// Connexion à la base de données
client.connect()
    .then(() => {
    console.log('Connected to the database');
})
    .catch(err => {
    console.error('Connection error', err.stack);
});
// Exporter le client pour l'utiliser ailleurs dans le projet
exports.default = client;
