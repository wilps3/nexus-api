import { Router } from "express";

import {
  createReservation,
  cancelReservation,
  getUserReservations,
  getAuth0UserReservations,
} from "../controllers/reservations.controller";

const router = Router();

router.post("/create", createReservation);

router.post("/cancel", cancelReservation);

router.get(
  "/user/:id",
  getUserReservations
);

router.get(
  "/auth0/:auth0_id",
  getAuth0UserReservations
);

export default router;