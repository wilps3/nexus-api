"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = createReservation;
exports.cancelReservation = cancelReservation;
exports.getUserReservations = getUserReservations;
const db_1 = __importDefault(require("../db"));
async function createReservation(req, res) {
    try {
        const { user_id, space_id, start_time, end_time, } = req.body;
        const conflict = await db_1.default.query(`
      SELECT id
      FROM coworking_reservations
      WHERE space_id = $1
        AND status = 'active'
        AND (
          start_time <= $3
          AND end_time >= $2
        )
      `, [
            space_id,
            start_time,
            end_time,
        ]);
        if (conflict.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Space already reserved",
            });
        }
        const result = await db_1.default.query(`
      INSERT INTO coworking_reservations
      (
        user_id,
        space_id,
        start_time,
        end_time,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'active'
      )
      RETURNING *
      `, [
            user_id,
            space_id,
            start_time,
            end_time,
        ]);
        res.status(201).json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to create reservation",
        });
    }
}
async function cancelReservation(req, res) {
    try {
        const { reservation_id } = req.body;
        const result = await db_1.default.query(`
      UPDATE coworking_reservations
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING *
      `, [reservation_id]);
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to cancel reservation",
        });
    }
}
async function getUserReservations(req, res) {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`
      SELECT
        coworking_reservations.id AS reservation_id,
        coworking_reservations.start_time,
        coworking_reservations.end_time,
        coworking_reservations.status,
        coworking_spaces.id AS space_id,
        coworking_spaces.name AS space_name,
        coworking_spaces.description AS space_description,
        coworking_spaces.capacity AS space_capacity,
        coworking_spaces.location AS space_location
      FROM coworking_reservations
      INNER JOIN coworking_spaces
        ON coworking_spaces.id =
        coworking_reservations.space_id
      WHERE coworking_reservations.user_id = $1
      ORDER BY coworking_reservations.created_at DESC
      `, [id]);
        res.json({
            success: true,
            total: result.rows.length,
            user_id: id,
            data: result.rows,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch reservations",
        });
    }
}
