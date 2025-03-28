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
import client from "./config/db";
import { createRateLimiter } from "./middlewares/rateLimit.middleware";
import morgan from "morgan";

// Configuration CORS
const corsOptions = {
  origin: "https://webstudio-url.com", // URL WEBSTUIDO A REMPLACER
  methods: "GET, POST, PUT, PATCH, DELETE", // Méthodes autorisées
  allowedHeaders: "Content-Type, Authorization", // En-têtes autorisés
};

const app = express();

// Middleware pour les logs
app.use(morgan("combined"));

// Configure trust proxy pour permettre l'utilisation de X-Forwarded-For
// app.set("trust proxy", true); // Faire confiance à un seul proxy

// Affiche l'adresse IP de l'utilisateur pour vérifier
// app.use((req, res, next) => {
//   console.log("Requête reçue !");
//   console.log("Méthode :", req.method);
//   console.log("URL :", req.originalUrl);
//   console.log("Adresse IP (req.ip) :", req.ip);
//   console.log("X-Forwarded-For :", req.headers["x-forwarded-for"]);
//   console.log("Tous les headers :", req.headers);
//   next();
// });

// const limiter = createRateLimiter(15 * 60 * 1000, 100);
// Applique CORS avec options
app.use(cors(corsOptions));
// app.use(limiter);
// Middleware pour parser les JSON
app.use(express.json());

// Middleware pour gérer les erreurs
if (process.env.NODE_ENV === "production") {
  console.log("Mode production détecté");
}

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", subscriptionRoutes);

app.listen(config.port, () => {
  console.log(`✅ Serveur démarré sur le port ${config.port}`);
});
