import { Request, Response } from "express";
import pool from "../db";

export async function resetUserData(req: Request, res: Response) {
  try {
    const userId = Number(req.body.user_id || 1);

    await pool.query("BEGIN");

    await pool.query(
      `
      DELETE FROM purchase_items
      WHERE purchase_id IN (
        SELECT id
        FROM purchases
        WHERE user_id = $1
      )
      `,
      [userId]
    );

    await pool.query(
      `
      DELETE FROM purchases
      WHERE user_id = $1
      `,
      [userId]
    );

    await pool.query(
      `
      DELETE FROM coworking_reservations
      WHERE user_id = $1
      `,
      [userId]
    );

    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "Datos del usuario reiniciados correctamente",
      user_id: userId,
    });
  } catch (error) {
    await pool.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to reset user data",
    });
  }
}