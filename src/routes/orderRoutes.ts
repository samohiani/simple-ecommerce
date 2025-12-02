import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, OrderController.createOrder);
router.get("/", authenticate, OrderController.getOrders);
router.get("/:id", authenticate, OrderController.getOrderById);
router.put("/:id/status", authenticate, OrderController.updateOrderStatus);
router.delete("/:id/cancel", authenticate, OrderController.cancelOrder);

export default router;
