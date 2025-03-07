"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const env_1 = require("./env");
const client = new pg_1.Client({
    host: env_1.config.db_host,
    port: env_1.config.db_port,
    user: env_1.config.db_user,
    password: env_1.config.db_password,
    database: env_1.config.db_name,
});
client
    .connect()
    .then(() => console.log("Connecté à PostgreSQL"))
    .catch((err) => console.error("Erreur de connexion à PostgreSQL", err));
exports.default = client;
