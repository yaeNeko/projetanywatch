import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
	res.json({ message: "API REST avec Express en TypeScript" });
});

// Démarrage du serveur
app.listen(port, () => {
	console.log(`URL de l'API: http://localhost:${port}`);
});
