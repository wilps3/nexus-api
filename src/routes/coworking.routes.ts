import { Router } from "express";
import {
  getCoworkingSpaceById,
  getCoworkingSpaces,
} from "../controllers/coworking.controller";

const router = Router();

router.get("/", getCoworkingSpaces);
router.get("/:id", getCoworkingSpaceById);

export default router;