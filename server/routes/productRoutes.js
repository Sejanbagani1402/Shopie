import { Router } from "express";
const router = Router();
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  createProductValidator,
  updateProductValidator,
} from "../validators/productValidator.js";

import { handleValidationErrors } from "../middlewares/validation.js";
import { authenticate, authorize } from "../middlewares/auth.js";

//Routes

router.get("/", getAllProducts);
router.get("/:id", getProductById);

//authenticated routes

router.post(
  "/",
  authenticate,
  createProductValidator,
  handleValidationErrors,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  updateProductValidator,
  handleValidationErrors,
  updateProduct
);

router.delete("/:id", authenticate, deleteProduct);

export default router;
