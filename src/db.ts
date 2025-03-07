import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement depuis .env

const client = new Client({
    host: process.env.DB_HOST,  
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

client.connect()
    .then(() => console.log('Connecté à PostgreSQL'))
    .catch(err => console.error('Erreur de connexion à PostgreSQL', err));

export default client; // ⚠️ Ne pas oublier d'exporter !
