"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserData = resetUserData;
const db_1 = __importDefault(require("../db"));
async function resetUserData(req, res) {
    try {
        const userId = Number(req.body.user_id || 1);
        await db_1.default.query("BEGIN");
        await db_1.default.query(`
      DELETE FROM purchase_items
      WHERE purchase_id IN (
        SELECT id
        FROM purchases
        WHERE user_id = $1
      )
      `, [userId]);
        await db_1.default.query(`
      DELETE FROM purchases
      WHERE user_id = $1
      `, [userId]);
        await db_1.default.query(`
      DELETE FROM coworking_reservations
      WHERE user_id = $1
      `, [userId]);
        await db_1.default.query("COMMIT");
        res.json({
            success: true,
            message: "Datos del usuario reiniciados correctamente",
            user_id: userId,
        });
    }
    catch (error) {
        await db_1.default.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to reset user data",
        });
    }
}
