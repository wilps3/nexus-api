import { Request, Response } from "express";
import pool from "../db";

export async function getCoworkingSpaces(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        coworking_spaces.id,
        coworking_spaces.name,
        coworking_spaces.description,
        coworking_spaces.capacity,
        coworking_spaces.location,
        coworking_spaces.is_active,
        active_reservations.id AS reservation_id,
        active_reservations.start_time AS occupied_from,
        active_reservations.end_time AS occupied_until,
        users.name AS occupied_by,
        CASE
          WHEN active_reservations.id IS NULL THEN false
          ELSE true
        END AS is_occupied
      FROM coworking_spaces
      LEFT JOIN LATERAL (
        SELECT *
        FROM coworking_reservations
        WHERE coworking_reservations.space_id = coworking_spaces.id
          AND coworking_reservations.status = 'active'
        ORDER BY coworking_reservations.created_at DESC
        LIMIT 1
      ) active_reservations ON true
      LEFT JOIN users
        ON active_reservations.user_id = users.id
      ORDER BY coworking_spaces.id ASC
    `);

    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch coworking spaces",
    });
  }
}

export async function getCoworkingSpaceById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        coworking_spaces.id,
        coworking_spaces.name,
        coworking_spaces.description,
        coworking_spaces.capacity,
        coworking_spaces.location,
        coworking_spaces.is_active,
        active_reservations.id AS reservation_id,
        active_reservations.start_time AS occupied_from,
        active_reservations.end_time AS occupied_until,
        users.name AS occupied_by,
        CASE
          WHEN active_reservations.id IS NULL THEN false
          ELSE true
        END AS is_occupied
      FROM coworking_spaces
      LEFT JOIN LATERAL (
        SELECT *
        FROM coworking_reservations
        WHERE coworking_reservations.space_id = coworking_spaces.id
          AND coworking_reservations.status = 'active'
        ORDER BY coworking_reservations.created_at DESC
        LIMIT 1
      ) active_reservations ON true
      LEFT JOIN users
        ON active_reservations.user_id = users.id
      WHERE coworking_spaces.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Coworking space not found",
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch coworking space",
    });
  }
}