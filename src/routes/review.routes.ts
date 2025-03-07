import { Router } from "express";
import { createReview } from "../controllers/review.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";
import { getReviewsForSerieAnime } from "../controllers/review.controller";

const router = Router();
const rateLimiter = createRateLimiter(1000, 1);

router.post("/", authenticateToken, rateLimiter, createReview);
router.get("/:serie_anime_id", getReviewsForSerieAnime);


export default router;
