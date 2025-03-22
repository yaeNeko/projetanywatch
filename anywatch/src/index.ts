import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import swaggerUi from "swagger-ui-express";
import reviewRoutes from "./routes/review.routes";
import swaggerSpec from "./swagger-output.json";
import subscriptionRoutes from "./routes/subscription.routes";
import { config } from "./config/env";
import cors from "cors";
import client from "./config/db"; // Assure-toi que le chemin est correct

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

// Route pour la documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", subscriptionRoutes);

app.listen(config.port, () => {
  console.log(`✅ Serveur démarré sur le port ${config.port}`);
});

const corsOptions = {
  origin: "https://ton-webstudio-url.com", // Remplace par l'URL de ton frontend Webstudio
  methods: "GET, POST, PUT, PATCH, DELETE", // Méthodes autorisées
  allowedHeaders: "Content-Type, Authorization", // En-têtes autorisés
};

// Applique CORS à toutes les routes
app.use(cors(corsOptions));

app.use(cors());
