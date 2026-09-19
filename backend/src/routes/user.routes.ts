import { Router } from "express";
import {
  getProfileHandler,
  getAllUsersHandler,
  librarianAddMemberHandler,
  getUserByIdHandler,
  deleteUserHandler,
  updateProfileHandler,
} from "../controllers/user.controller";
import { verifyToken, requireAdmin } from "../middleware/auth"; // Adjust path if needed
import { upload } from '../middleware/upload';
const router = Router();

// Route to get current user's profile (Requires being logged in)

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get currently logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64b8f3b20c1a9c3e4455abcd
 *                     email:
 *                       type: string
 *                       example: dev@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *       401:
 *         description: Access Denied or Invalid Token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile", verifyToken, getProfileHandler);

// Route to get all users (Requires being logged in AND being an admin)

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all registered users (Librarian only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64b8f3b20c1a9c3e4455abcd
 *                       email:
 *                         type: string
 *                         example: admin@example.com
 *                       role:
 *                         type: string
 *                         example: admin
 *       401:
 *         description: Access Denied or Invalid Token
 *       403:
 *         description: Forbidden (User is not an Admin)
 *       500:
 *         description: Internal server error
 */
router.get("/all", verifyToken, requireAdmin, getAllUsersHandler);

/**
 * @swagger
 * /api/users/add-member:
 *   post:
 *     summary: Create a new member account (Librarian only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@library.com
 *               role:
 *                 type: string
 *                 enum: [member, librarian]
 *                 default: member
 *                 example: member
 *               profileImage:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       201:
 *         description: Account successfully provisioned
 *       403:
 *         description: Forbidden - Requires Librarian role privileges
 */
router.post(
  "/add-member",
  verifyToken,
  requireAdmin,
  librarianAddMemberHandler,
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get detailed profile of a specific user by ID (Librarian only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The 24-character MongoDB User ID
 *         example: 64b8f3b20c1a9c3e4455abcd
 *     responses:
 *       200:
 *         description: User profile details retrieved successfully
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized (Token missing/invalid)
 *       403:
 *         description: Forbidden (Requires Librarian role)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", verifyToken, requireAdmin, getUserByIdHandler); // <-- ADD THIS

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a specific user account (Librarian only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The 24-character MongoDB User ID to remove
 *         example: 64b8f3b20c1a9c3e4455abcd
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       400:
 *         description: Invalid ID format or trying to self-delete
 *       401:
 *         description: Unauthorized (Token missing/invalid)
 *       403:
 *         description: Forbidden (Requires Librarian privileges)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, requireAdmin, deleteUserHandler);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update currently logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Johnny
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               profileImage:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  "/profile",
  verifyToken,
  upload.single("profileImage"),
  updateProfileHandler,
);
export default router;
