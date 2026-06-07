"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("../controllers/categories.controller");
const router = (0, express_1.Router)();
router.get("/", categories_controller_1.getCategories);
exports.default = router;
