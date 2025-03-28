"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const watchlist_routes_1 = __importDefault(require("./routes/watchlist.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const env_1 = require("./config/env");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const morgan_1 = __importDefault(require("morgan"));
// Configuration CORS
const corsOptions = {
    origin: "https://webstudio-url.com", // URL WEBSTUIDO A REMPLACER
    methods: "GET, POST, PUT, PATCH, DELETE", // Méthodes autorisées
    allowedHeaders: "Content-Type, Authorization", // En-têtes autorisés
};
const app = (0, express_1.default)();
// Middleware pour les logs
app.use((0, morgan_1.default)("combined"));
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
app.use((0, cors_1.default)(corsOptions));
// app.use(limiter);
// Middleware pour parser les JSON
app.use(express_1.default.json());
// Middleware pour gérer les erreurs
if (process.env.NODE_ENV === "production") {
    console.log("Mode production détecté");
}
// Route pour la documentation Swagger
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "API REST avec Express en TypeScript" });
}));
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT NOW()");
        res.json({ message: "Connexion réussie", time: result.rows[0] });
    }
    catch (error) {
        console.error("Erreur API :", error);
        res.status(500).json({ error: "Erreur de connexion" });
    }
}));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/watchlist", watchlist_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api", subscription_routes_1.default);
app.listen(env_1.config.port, () => {
    console.log(`✅ Serveur démarré sur le port ${env_1.config.port}`);
});
