"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { Client } = require("pg");
const { config } = require("./env"); // Assurez-vous que "config" vient bien du fichier env.js

// Connexion à la base de données PostgreSQL
const client = new Client({
    host: config.db_host,
    port: config.db_port,
    user: config.db_user,
    password: config.db_password,
    database: config.db_name,
});

client
    .connect()
    .then(() => console.log("Connecté à PostgreSQL"))
    .catch((err) => console.error("Erreur de connexion à PostgreSQL", err));

exports.default = client; // Exporter le client pour l'utiliser ailleurs
