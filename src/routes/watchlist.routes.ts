import { Router } from "express";
import { deleteWatchlist, getTopSeries, getWatchlist } from "../controllers/watchlist.controller";
import { getAllWatchlists } from "../controllers/watchlist.controller";
import { getSeriesInWatchlist, updateStatus, removeFromWatchlist, createWatchlist, addToWatchlist } from "../controllers/watchlist.controller";
import { authenticateToken, isWatchlistOwner } from "../middlewares/auth.middleware";

const router = Router();

// Routes publiques - accessibles sans authentification
router.get("/series/top", getTopSeries); // Récupère le TOP 5 des plus ajoutés en watchlist

// Routes protégées - nécessitent une authentification
// Routes en lecture
router.get("/:id", authenticateToken, getWatchlist); // Récupère les séries et animés dans une watchlist spécifique
router.get("/user/:userId", authenticateToken, getAllWatchlists); // Récupère toutes les watchlists d'un utilisateur
router.get("/:watchlistId/series", authenticateToken, getSeriesInWatchlist); // Récupère les séries dans une watchlist

// Routes nécessitant des droits de propriétaire
// POST
router.post("/creer", authenticateToken, createWatchlist); // Crée une nouvelle watchlist
router.post("/ajouter/:watchlistId/:serieAnimeId", authenticateToken, isWatchlistOwner, addToWatchlist); // Ajoute une série/animé à une watchlist

// PATCH
router.patch("/statut/:watchlistId/:serieAnimeId", authenticateToken, isWatchlistOwner, updateStatus); // Change le statut d'un animé/série dans la watchlist

// DELETE
router.delete("/supprimer/:watchlistId/:serieAnimeId", authenticateToken, isWatchlistOwner, removeFromWatchlist); // Supprime un animé/série dans la watchlist
router.delete("/supprimer/:watchlistId", authenticateToken, isWatchlistOwner, deleteWatchlist); // Supprime une watchlist

export default router;
