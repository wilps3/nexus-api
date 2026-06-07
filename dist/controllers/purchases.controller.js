"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPurchase = createPurchase;
exports.getUserPurchases = getUserPurchases;
const db_1 = __importDefault(require("../db"));
async function createPurchase(req, res) {
    try {
        const { publication_id, user_id } = req.body;
        if (!publication_id || !user_id) {
            res.status(400).json({
                success: false,
                error: "publication_id and user_id are required",
            });
            return;
        }
        const publicationResult = await db_1.default.query(`
      SELECT id, price, stock
      FROM publications
      WHERE id = $1
      `, [publication_id]);
        if (publicationResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                error: "Publication not found",
            });
            return;
        }
        const publication = publicationResult.rows[0];
        if (publication.stock <= 0) {
            res.status(400).json({
                success: false,
                error: "Publication out of stock",
            });
            return;
        }
        const purchaseResult = await db_1.default.query(`
      INSERT INTO purchases (
        user_id,
        total,
        status
      )
      VALUES (
        $1,
        $2,
        'completed'
      )
      RETURNING *
      `, [user_id, publication.price]);
        const purchase = purchaseResult.rows[0];
        const itemResult = await db_1.default.query(`
      INSERT INTO purchase_items (
        purchase_id,
        publication_id,
        quantity,
        unit_price
      )
      VALUES (
        $1,
        $2,
        1,
        $3
      )
      RETURNING *
      `, [purchase.id, publication.id, publication.price]);
        await db_1.default.query(`
      UPDATE publications
      SET stock = stock - 1
      WHERE id = $1
      `, [publication.id]);
        res.status(201).json({
            success: true,
            data: {
                purchase,
                item: itemResult.rows[0],
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to create purchase",
        });
    }
}
async function getUserPurchases(req, res) {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`
      SELECT
        purchases.id AS purchase_id,
        purchases.created_at,
        purchases.status,
        publications.id AS publication_id,
        publications.title,
        publications.slug,
        publications.description,
        publications.type,
        publications.isbn,
        publications.publication_year,
        publications.cover_url,
        purchase_items.quantity,
        purchase_items.unit_price
      FROM purchases
      INNER JOIN purchase_items
        ON purchases.id = purchase_items.purchase_id
      INNER JOIN publications
        ON purchase_items.publication_id = publications.id
      WHERE purchases.user_id = $1
        AND purchases.status = 'completed'
      ORDER BY purchases.created_at DESC
      `, [id]);
        res.json({
            success: true,
            user_id: id,
            total: result.rows.length,
            data: result.rows,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user purchases",
        });
    }
}
