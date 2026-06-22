import { Request, Response } from "express";
import pool from "../db";

export async function getCategories(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
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
      data: result.rows.map((category: any) => ({
        ...category,
        type: "publication",
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
}