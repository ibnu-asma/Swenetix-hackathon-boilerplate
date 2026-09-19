import { Router } from "express";
import { getStatsController } from "../controllers/stats.controller";
import { verifyToken, requireAdmin } from "../middleware/auth";
const router = Router();


/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized or Invalid Token
 *       403:
 *         description: Forbidden (User is not an Admin)
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", verifyToken, requireAdmin, getStatsController);

export default router;