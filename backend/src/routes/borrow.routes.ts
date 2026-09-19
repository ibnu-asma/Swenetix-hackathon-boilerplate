import { Router } from "express";
import {
  borrowBook,
  returnBook,
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
router.post("/", verifyToken, requireAdmin, borrowBook);

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

export default router;