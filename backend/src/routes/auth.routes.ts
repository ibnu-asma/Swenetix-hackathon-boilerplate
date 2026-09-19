import { Router } from 'express';
import { registerHandler, loginHandler, logoutHandler } from '../controllers/auth.controller';
import {registerUserSchema} from '../utils/schemas';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';





const router = Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new library account
 *     tags: [Auth]
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
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: member@library.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
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
 *         description: User registered successfully
 *       400:
 *         description: Validation or duplication error
 */

router.post('/register', upload.single('profileImage'), validate(registerUserSchema), registerHandler);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dev@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   example: user
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginHandler);




/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Log out successful
 *       500:
 *         description: Internal server error
 */
router.post('/logout', logoutHandler);

export default router;