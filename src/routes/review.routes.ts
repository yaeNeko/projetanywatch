import { Router } from "express";
import { createReview } from "../controllers/review.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();
const rateLimiter = createRateLimiter(1000, 1);

router.post("/", authenticateToken, rateLimiter, createReview);

export default router;
