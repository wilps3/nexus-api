import { Router } from "express";
import { createPurchase } from "../controllers/purchases.controller";

const router = Router();

router.post("/create", createPurchase);

export default router;