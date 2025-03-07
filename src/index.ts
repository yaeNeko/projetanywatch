import express from 'express';
import cors from 'cors';
import client from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
    try {
        const result = await client.query('SELECT NOW()');
        res.json({ message: 'Connexion réussie', time: result.rows[0] });
    } catch (error) {
        console.error('Erreur API :', error);
        res.status(500).json({ error: 'Erreur de connexion' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
