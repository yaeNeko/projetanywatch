<<<<<<< HEAD:anywatch/src/routes/watchlist.routes.ts
import { Router } from "express";
import {
  getTopSeries,
  getWatchlist,
} from "../controllers/watchlist.controller";
import { getAllWatchlists } from "../controllers/watchlist.controller";
import { getSeriesInWatchlist, updateStatus, removeFromWatchlist } from "../controllers/watchlist.controller";

const router = Router();

// Route pour récupérer les séries et animés dans une watchlist spécifique
router.get("/:id", getWatchlist);

// Route pour récupérer toutes les watchlists d'un utilisateur
router.get("/user/:userId", getAllWatchlists);

// Route pour récupérer les séries dans une watchlist
router.get("/:watchlistId/series", getSeriesInWatchlist);

// Route pour Récupérer le TOP 5 des plus ajoutés en watchlist
router.get("/series/top", getTopSeries);

// Route PATCH pour changer le statut d'un animé/série dans la watchlist
router.patch('/statut/:watchlistId/:serieAnimeId', updateStatus);

// Route pour supprimer un animé/série dans la watchlist
router.delete('/supprimer/:watchlistId/:serieAnimeId', removeFromWatchlist);

export default router;
=======
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
>>>>>>> 3cab03ced567a1c747edbdb11c21861652f374e0:src/routes/watchlist.routes.ts
