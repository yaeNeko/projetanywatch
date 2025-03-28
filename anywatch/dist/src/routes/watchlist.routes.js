"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const watchlist_controller_1 = require("../controllers/watchlist.controller");
const watchlist_controller_2 = require("../controllers/watchlist.controller");
const watchlist_controller_3 = require("../controllers/watchlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Routes publiques - accessibles sans authentification
router.get("/series/top", watchlist_controller_1.getTopSeries); // Récupère le TOP 5 des plus ajoutés en watchlist
// Routes protégées - nécessitent une authentification
// Routes en lecture
router.get("/:id", auth_middleware_1.authenticateToken, watchlist_controller_1.getWatchlist); // Récupère les séries et animés dans une watchlist spécifique
router.get("/user/:userId", auth_middleware_1.authenticateToken, watchlist_controller_2.getAllWatchlists); // Récupère toutes les watchlists d'un utilisateur
router.get("/:watchlistId/series", auth_middleware_1.authenticateToken, watchlist_controller_3.getSeriesInWatchlist); // Récupère les séries dans une watchlist
// Routes nécessitant des droits de propriétaire
// POST
router.post("/creer", auth_middleware_1.authenticateToken, watchlist_controller_3.createWatchlist); // Crée une nouvelle watchlist
router.post("/ajouter/:watchlistId/:serieAnimeId", auth_middleware_1.authenticateToken, auth_middleware_1.isWatchlistOwner, watchlist_controller_3.addToWatchlist); // Ajoute une série/animé à une watchlist
// PATCH
router.patch("/statut/:watchlistId/:serieAnimeId", auth_middleware_1.authenticateToken, auth_middleware_1.isWatchlistOwner, watchlist_controller_3.updateStatus); // Change le statut d'un animé/série dans la watchlist
// DELETE
router.delete("/supprimer/:watchlistId/:serieAnimeId", auth_middleware_1.authenticateToken, auth_middleware_1.isWatchlistOwner, watchlist_controller_3.removeFromWatchlist); // Supprime un animé/série dans la watchlist
router.delete("/supprimer/:watchlistId", auth_middleware_1.authenticateToken, auth_middleware_1.isWatchlistOwner, watchlist_controller_1.deleteWatchlist); // Supprime une watchlist
exports.default = router;
