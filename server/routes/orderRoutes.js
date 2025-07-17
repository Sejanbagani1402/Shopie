import express from "express";
import {
  createOrder,
  getOrderDetails,
} from "../controllers/orderController.js";
import { updateOrderStatus } from "../controllers/orderStatusController.js";
import { getUserOrders } from "../controllers/userOrderController.js";
import { getAllOrders } from "../controllers/adminOrderController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { orderQueryValidator } from "../validators/orderValidators.js";
import { validateOrderOwnership } from "../middlewares/orderMiddleware.js";

const router = express.Router();

router.post("/", auth.createOrder);
router.get(
  "/user/:customerId",
  auth,
  validate(orderQueryValidator),
  getUserOrders
);
router.get(
  "/user/:customerId/:orderId",
  auth,
  validateOrderOwnership,
  getOrderDetails
);

router.put("/:orderId/status", auth, updateOrderStatus);

router.get(
  "/admin/all",
  adminAuth,
  validate(orderQueryValidator),
  getAllOrders
);

export default router;
