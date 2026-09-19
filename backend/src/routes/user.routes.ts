import { Router } from 'express';
import { getProfileHandler, getAllUsersHandler } from '../controllers/user.controller';
import { verifyToken, requireAdmin } from '../middleware/auth'; // Adjust path if needed

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
router.get('/profile', verifyToken, getProfileHandler);


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
router.get('/all', verifyToken, requireAdmin, getAllUsersHandler);

export default router;

