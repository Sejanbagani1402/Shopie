import express, { Router } from "express";
import {
  updateStockAfterOrder,
  restockProducts,
  getInventoryHistory,
  getLowStockProducts,
} from "../controllers/inventoryController.js";
import {
  updateStockValidator,
  restockValidator,
  inventoryHistoryValidator,
  lowStockValidator,
} from "../validators/inventoryValidators.js";
import { validate } from "../middlewares/validate.js";
import { auth, adminAuth } from "../middlewares/auth.js";
import {
  validateProductsExist,
  checkStockAvailability,
} from "../middlewares/inventoryMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();
router.use(adminAuth);
router.post(
  "/order/:orderId",
  validate(updateStockValidator),
  checkStockAvailability,
  updateStockAfterOrder
);
router.post(
  "/restock",
  validate(restockValidator),
  validateProductsExist,
  restockProducts
);

router.get(
  "/history",
  validate(inventoryHistoryValidator),
  getInventoryHistory
);

router.get("/low-stock", validate(lowStockValidator), getLowStockProducts);

export default router;
