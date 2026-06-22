import { Router } from "express";
import { resetUserData } from "../controllers/dev.controller";

const router = Router();

router.post("/reset-user-data", resetUserData);

export default router;