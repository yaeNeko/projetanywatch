"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const watchlist_controller_1 = require("../controllers/watchlist.controller");
const watchlist_controller_2 = require("../controllers/watchlist.controller");
const watchlist_controller_3 = require("../controllers/watchlist.controller");
const router = (0, express_1.Router)();
// Route pour récupérer les séries et animés dans une watchlist spécifique
router.get("/:id", watchlist_controller_1.getWatchlist);
// Route pour récupérer toutes les watchlists d'un utilisateur
router.get("/user/:userId", watchlist_controller_2.getAllWatchlists);
// Route pour récupérer les séries dans une watchlist
router.get("/:watchlistId/series", watchlist_controller_3.getSeriesInWatchlist);
// Route pour Récupérer le TOP 5 des plus ajoutés en watchlist
router.get("/series/top", watchlist_controller_1.getTopSeries);
// Route PATCH pour changer le statut d'un animé/série dans la watchlist
router.patch('/statut/:watchlistId/:serieAnimeId', watchlist_controller_3.updateStatus);
exports.default = router;
