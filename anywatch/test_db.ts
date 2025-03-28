import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://postgres:IyiSwZYIzgsPwpCgcGDZtYiklKGPTNJX@mainline.proxy.rlwy.net:10634/railway",
  ssl: { rejectUnauthorized: false },
});

client
  .connect()
  .then(() => console.log("✅ Connexion réussie"))
  .catch((err) => console.error("❌ Erreur de connexion", err))
  .finally(() => client.end());
