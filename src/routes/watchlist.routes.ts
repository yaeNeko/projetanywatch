import { Router } from "express";
import { deleteWatchlist, getTopSeries, getWatchlist } from "../controllers/watchlist.controller";
import { getAllWatchlists } from "../controllers/watchlist.controller";
import { getSeriesInWatchlist, updateStatus, removeFromWatchlist, createWatchlist, addToWatchlist } from "../controllers/watchlist.controller";

const router = Router();

// GET
router.get("/:id", getWatchlist); // Récupère les séries et animés dans une watchlist spécifique
router.get("/user/:userId", getAllWatchlists); // Récupère toutes les watchlists d'un utilisateur
router.get("/:watchlistId/series", getSeriesInWatchlist); // Récupère les séries dans une watchlist
router.get("/series/top", getTopSeries); // Récupère le TOP 5 des plus ajoutés en watchlist

// PATCH
router.patch("/statut/:watchlistId/:serieAnimeId", updateStatus); // Change le statut d'un animé/série dans la watchlist

// POST
router.post("/creer", createWatchlist); // Crée une nouvelle watchlist
router.post("/ajouter/:watchlistId/:serieAnimeId", addToWatchlist); // Ajoute une série/animé à une watchlist

// DELETE
router.delete("/supprimer/:watchlistId/:serieAnimeId", removeFromWatchlist); // Supprime un animé/série dans la watchlist
router.delete("/supprimer/:watchlistId", deleteWatchlist); // Supprime une watchlist

export default router;
