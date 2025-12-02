import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", ProductController.getProducts);
router.post("/", authenticate, ProductController.createProduct);
router.get("/:id", ProductController.getProductById);
router.put("/", authenticate, ProductController.updateProduct);
router.delete("/", authenticate, ProductController.deleteProduct);

export default router;
