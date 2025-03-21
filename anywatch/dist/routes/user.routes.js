"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
const rateLimiter = (0, rateLimit_middleware_1.createRateLimiter)(1000, 1);
// Définition de la route pour récupérer un profil par ID
router.get("/:id", rateLimiter, user_controller_1.getUserProfile);
// Route PATCH pour changer la visibilité de l'utilisateur (public/privé)
router.patch('/visibility/:id', user_controller_1.updateVisibility);
// Route PUT pour changer les infos de l'utilisateur
router.put('/modification/:id', user_controller_1.updateUserProfile);
// Surpprimer un utilisateur
router.delete('/supprimer/:userId', user_controller_1.deleteUser);
exports.default = router;
