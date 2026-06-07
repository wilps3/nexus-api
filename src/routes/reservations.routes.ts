import { Router } from "express";

import {
  createReservation,
  cancelReservation,
  getUserReservations,
} from "../controllers/reservations.controller";

const router = Router();

router.post("/create", createReservation);

router.post("/cancel", cancelReservation);

router.get(
  "/user/:id",
  getUserReservations
);

export default router;