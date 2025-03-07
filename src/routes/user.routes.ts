
import { Router } from "express";
import { getUserProfile , updateVisibility, updateUserProfile } from "../controllers/user.controller";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();
const rateLimiter = createRateLimiter(1000, 1);

// Définition de la route pour récupérer un profil par ID
router.get("/:id", rateLimiter, getUserProfile);

// Route PATCH pour changer la visibilité de l'utilisateur (public/privé)
router.patch('/visibility/:id', updateVisibility);

// Route PUT pour changer les infos de l'utilisateur
router.put('/modification/:id', updateUserProfile);


export default router;

