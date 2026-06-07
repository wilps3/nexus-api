"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publications_controller_1 = require("../controllers/publications.controller");
const router = (0, express_1.Router)();
router.get("/", publications_controller_1.getPublications);
router.get("/bestsellers", publications_controller_1.getBestsellers);
router.get("/:id", publications_controller_1.getPublicationById);
exports.default = router;
