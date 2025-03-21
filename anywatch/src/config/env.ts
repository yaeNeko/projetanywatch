import { Pool } from "pg"; // Importation de pg
import fs from "fs";

// Récupère le port en tant que nombre
const dbPort = parseInt(process.env.DB_PORT || "5432", 10);

// Configuration de la connexion à PostgreSQL
const config = {
  user: process.env.DB_USER, // Utilisateur
  host: process.env.DB_HOST, // Hôte
  database: process.env.DB_NAME, // Nom de la base de données
  password: process.env.DB_PASSWORD, // Mot de passe
  port: dbPort, // Port, converti en nombre
  ssl: process.env.DB_SSL_CA
    ? {
        ca: fs.readFileSync(process.env.DB_SSL_CA, "utf8"), // Lecture du certificat
        rejectUnauthorized: false, // Ignore la vérification du certificat (utilisé pour le développement ou les environnements de test)
      }
    : false, // Désactive SSL si aucune variable d'environnement DB_SSL_CA n'est définie
};

// Création d'un pool de connexions
const pool = new Pool(config);

// Exemple d'une requête
async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connexion réussie :", res.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la connexion à la base de données", err);
  } finally {
    await pool.end(); // Ferme la connexion une fois que l'opération est terminée
  }
}

testConnection();
