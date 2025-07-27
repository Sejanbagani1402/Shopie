import express from "express";
import {
  createOrder,
  getOrderDetails,
} from "../controllers/orderController.js";
import { updateOrderStatus } from "../controllers/orderStatusController.js";
import { getUserOrders } from "../controllers/userOrderController.js";
import { getAllOrders } from "../controllers/adminOrderController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { handleValidationErrors } from "../middlewares/validation.js";
import { orderQueryValidator } from "../validators/orderValidator.js";
import { validateOrderOwnership } from "../middlewares/orderMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get(
  "/user/:customerId",
  authenticate,
  handleValidationErrors,
  orderQueryValidator,
  getUserOrders
);
router.get(
  "/user/:customerId/:orderId",
  authenticate,
  validateOrderOwnership,
  getOrderDetails
);

router.put("/:orderId/status", authenticate, updateOrderStatus);

router.get(
  "/admin/all",
  authenticate,
  authorize,
  handleValidationErrors,
  orderQueryValidator,
  getAllOrders
);

export default router;
