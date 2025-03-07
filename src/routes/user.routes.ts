import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();
const rateLimiter = createRateLimiter(1000, 1);

// Définition de la route pour récupérer un profil par ID
router.get("/:id", rateLimiter, getUserProfile);

export default router;
