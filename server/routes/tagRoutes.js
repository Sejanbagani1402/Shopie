import { Router } from "express";
const router = Router();
import {
  getAllTags,
  getTagsById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";

import {
  createTagValidator,
  updateTagValidator,
} from "../validators/tagValidator.js";

import { handleValidationErrors } from "../middlewares/validation.js";
import { authenticate, authorize } from "../middlewares/auth.js";

//Routes

router.get("/", getAllTags);
router.get("/:id", getTagsById);

//authenticated routes

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createTagValidator,
  handleValidationErrors,
  createTag
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateTagValidator,
  handleValidationErrors,
  updateTag
);

router.delete("/:id", authenticate, authorize("admin"), deleteTag);

export default router;
