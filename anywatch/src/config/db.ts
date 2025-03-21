const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Pour accepter les certificats auto-signés (non recommandé pour production)
  },
});

client.connect();
