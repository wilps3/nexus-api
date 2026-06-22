import { Router } from "express";
import { getUserPurchases } from "../controllers/purchases.controller";

const router = Router();

router.get("/:id/purchases", getUserPurchases);

export default router;