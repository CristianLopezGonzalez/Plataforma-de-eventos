import { AuthController } from "../controllers/authController";
import { Router } from "express";
import { AuthMiddlewares } from "../middlewares/authMiddlewares";

const router = Router();

const authController = new AuthController();
const authMiddlewares = new AuthMiddlewares();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/change-password', authMiddlewares.authenticateToken, authController.changePassword);

export default router;