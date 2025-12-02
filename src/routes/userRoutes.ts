import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", authenticate, UserController.getUserProfile);

export default router;
