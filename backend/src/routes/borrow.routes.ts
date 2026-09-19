import { Router } from "express";
import {
  borrowBook,
  returnBook,
  getCurrentBorrowingsHandler,
  getBorrowingHistoryHandler,
  renewBookHandler,
} from "../controllers/borrow.controller";
import { verifyToken } from "../middleware/auth";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/borrowings:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: Invalid request or borrowing limit reached
 *       401:
 *         description: Unauthorized or Invalid Token
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, borrowBook);

/**
 * @swagger
 * /api/borrowings/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrowing ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book has already been returned
 *       401:
 *         description: Unauthorized or Invalid Token
 *       404:
 *         description: Borrowing record not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/return", verifyToken, requireAdmin, returnBook);

/**
 * @swagger
 * /api/borrowings/current:
 *   get:
 *     summary: Get current user's active borrowings
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current borrowings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/current", verifyToken, getCurrentBorrowingsHandler);

/**
 * @swagger
 * /api/borrowings/history:
 *   get:
 *     summary: Get borrowing history for current user
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Borrowing history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/history", verifyToken, getBorrowingHistoryHandler);

/**
 * @swagger
 * /api/borrowings/{id}/renew:
 *   post:
 *     summary: Renew a borrowed book
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrowing ID
 *     responses:
 *       200:
 *         description: Book renewed successfully
 *       400:
 *         description: Cannot renew book
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/renew", verifyToken, renewBookHandler);

export default router;