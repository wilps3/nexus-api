import { Request, Response } from "express";
import pool from "../db";

export async function getPublications(req: Request, res: Response) {
  try {
    const { category, year } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];

    if (category) {
      values.push(category);
      conditions.push(`categories.slug = $${values.length}`);
    }

    if (year) {
      values.push(Number(year));
      conditions.push(`publications.publication_year = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `
      SELECT
        publications.id,
        publications.title,
        publications.slug,
        publications.description,
        publications.type,
        publications.isbn,
        publications.publication_year,
        publications.price,
        publications.stock,
        publications.cover_url,
        publications.is_bestseller,
        categories.name AS category,
        categories.slug AS category_slug
      FROM publications
      INNER JOIN categories
        ON publications.category_id = categories.id
      ${whereClause}
      ORDER BY publications.id ASC
      `,
      values
    );

    res.json({
      success: true,
      filters: {
        category: category || null,
        year: year || null,
      },
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch publications",
    });
  }
}

export async function getBestsellers(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        publications.id,
        publications.title,
        publications.slug,
        publications.description,
        publications.type,
        publications.isbn,
        publications.publication_year,
        publications.price,
        publications.stock,
        publications.cover_url,
        publications.is_bestseller,
        categories.name AS category,
        categories.slug AS category_slug
      FROM publications
      INNER JOIN categories
        ON publications.category_id = categories.id
      WHERE publications.is_bestseller = true
      ORDER BY publications.id ASC
      LIMIT 10
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
      error: "Failed to fetch bestsellers",
    });
  }
}

export async function getPublicationById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        publications.id,
        publications.title,
        publications.slug,
        publications.description,
        publications.type,
        publications.isbn,
        publications.publication_year,
        publications.price,
        publications.stock,
        publications.cover_url,
        publications.is_bestseller,
        categories.name AS category,
        categories.slug AS category_slug
      FROM publications
      INNER JOIN categories
        ON publications.category_id = categories.id
      WHERE publications.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Publication not found",
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
      error: "Failed to fetch publication",
    });
  }
}