import { Client } from 'pg';

// Configuration de la connexion à la base de données
const client = new Client({
  connectionString: process.env.DATABASE_URL,  // Assure-toi que cette variable d'environnement est définie
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
export default client;
