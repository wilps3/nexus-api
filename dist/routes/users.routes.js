"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchases_controller_1 = require("../controllers/purchases.controller");
const router = (0, express_1.Router)();
router.get("/:id/purchases", purchases_controller_1.getUserPurchases);
exports.default = router;
