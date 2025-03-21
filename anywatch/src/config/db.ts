import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .then(() => {
    console.log("Connexion réussie à la base de données !");
  })
  .catch((err: Error) => {
    console.error("Erreur de connexion à la base de données :", err);
  });
