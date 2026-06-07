"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
const db_1 = __importDefault(require("../db"));
async function getCategories(_req, res) {
    try {
        const result = await db_1.default.query(`
      SELECT
        id,
        name,
        slug
      FROM categories
      ORDER BY name ASC
    `);
        res.json({
            success: true,
            total: result.rows.length,
            data: result.rows.map((category) => ({
                ...category,
                type: "publication",
            })),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch categories",
        });
    }
}
