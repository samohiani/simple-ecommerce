import { Router } from "express";
import { CartController } from "../controllers/cartController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, CartController.getCart);
router.post("/add", authenticate, CartController.addToCart);
router.post("/bulk-add", authenticate, CartController.addProductsToCart);
router.post("/remove", authenticate, CartController.removeFromCart);
router.put("/update", authenticate, CartController.updateQuantity);
router.delete("/clear", authenticate, CartController.clearCart);

export default router;
