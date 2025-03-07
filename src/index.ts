import express from "express";
import authRoutes from "./routes/auth.routes";
import client from "./config/db";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", async (req, res) => {
	res.json({ message: "API REST avec Express en TypeScript" });
});

app.get("/test", async (req, res) => {
	try {
		const result = await client.query("SELECT NOW()");
		res.json({ message: "Connexion réussie", time: result.rows[0] });
	} catch (error) {
		console.error("Erreur API :", error);
		res.status(500).json({ error: "Erreur de connexion" });
	}
});

// Démarrage du serveur
app.listen(port, () => {
	console.log(`URL de l'API: http://localhost:${port}`);
});
