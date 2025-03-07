import express from "express";
import { getSubscriptions } from "../controllers/subscription.controller";

const router = express.Router();

router.get("/subscriptions", getSubscriptions);

export default router;
