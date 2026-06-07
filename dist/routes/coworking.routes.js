"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coworking_controller_1 = require("../controllers/coworking.controller");
const router = (0, express_1.Router)();
router.get("/", coworking_controller_1.getCoworkingSpaces);
router.get("/:id", coworking_controller_1.getCoworkingSpaceById);
exports.default = router;
