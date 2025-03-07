"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const watchlist_controller_1 = require("../controllers/watchlist.controller");
const router = (0, express_1.Router)();
// Route PATCH pour changer le statut d'un animé/série dans la watchlist
router.patch('/statut/:watchlistId/:serieAnimeId', watchlist_controller_1.updateStatus);
exports.default = router;
