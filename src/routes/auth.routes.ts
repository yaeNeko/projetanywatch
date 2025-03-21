import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();
const rateLimiter = createRateLimiter(1000, 1);

router.post("/register", rateLimiter, signup);
router.post("/login", rateLimiter, login);

export default router;
