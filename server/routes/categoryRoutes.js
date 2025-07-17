import { Router } from "express";
const router = Router();
import {
  getAllCategories,
  getCategoriesById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/categoryValidator.js";

import { handleValidationErrors } from "../middlewares/validation.js";
import { authenticate, authorize } from "../middlewares/auth.js";

//Routes

router.get("/", getAllCategories);
router.get("/:id", getCategoriesById);

//authenticated routes

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createCategoryValidator,
  handleValidationErrors,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateCategoryValidator,
  handleValidationErrors,
  updateCategory
);

router.delete("/:id", authenticate, authorize("admin"), deleteCategory);

export default router;
