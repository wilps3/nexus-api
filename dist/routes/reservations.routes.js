"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservations_controller_1 = require("../controllers/reservations.controller");
const router = (0, express_1.Router)();
router.post("/create", reservations_controller_1.createReservation);
router.post("/cancel", reservations_controller_1.cancelReservation);
router.get("/user/:id", reservations_controller_1.getUserReservations);
exports.default = router;
