import { Router } from "express";
import { createReview } from "../controllers/review.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateToken, createReview);

export default router;
