import { Router } from "express";
import {
  createPurchase,
  getAuth0UserPurchases,
} from "../controllers/purchases.controller";

const router = Router();

router.post("/create", createPurchase);

router.get(
  "/auth0/:auth0_id",
  getAuth0UserPurchases
);

export default router;