import { Router } from "express";
import {
  getBestsellers,
  getPublicationById,
  getPublications,
} from "../controllers/publications.controller";

const router = Router();

router.get("/", getPublications);
router.get("/bestsellers", getBestsellers);
router.get("/:id", getPublicationById);

export default router;