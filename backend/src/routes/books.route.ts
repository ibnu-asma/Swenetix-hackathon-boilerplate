import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/books.controller";
import { verifyToken, requireAdmin } from "../middleware/auth";
const router = Router();


/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid request or duplicate ISBN
 *       401:
 *         description: Unauthorized or Invalid Token
 *       403:
 *         description: Forbidden (User is not an Admin)
 *       500:
 *         description: Internal server error
 */
router.post("/",verifyToken, requireAdmin, createBook);
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books retrieved successfully
 *       401:
 *         description: Unauthorized or Invalid Token
 *       403:
 *         description: Forbidden (User is not an Admin)
 *       500:
 *         description: Internal server error
 */
router.get("/", getBooks);
/**
 * @swagger
 * /api/books/:id:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *       401:
 *         description: Unauthorized or Invalid Token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getBookById);
/**
 * @swagger
 * /api/books/:id:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Invalid request or duplicate ISBN
 *       401:
 *         description: Unauthorized or Invalid Token
 *       403:
 *         description: Forbidden (User is not an Admin)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken, requireAdmin, updateBook);
/**
 * @swagger
 * /api/books/:id:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized or Invalid Token
 *       403:
 *         description: Forbidden (User is not an Admin)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id",verifyToken, requireAdmin, deleteBook);
 
export default router;