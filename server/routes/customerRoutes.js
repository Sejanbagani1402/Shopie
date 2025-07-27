import express from "express";
import {
  createCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  addShippingAddress,
  updateShippingAddress,
  setBillingAddress,
  getCustomerOrders,
} from "../controllers/customerController.js";
import {
  validateCreateCustomer,
  validateUpdateProfile,
  validateAddShippingAddress,
  validateUpdateShippingAddress,
  validateSetBillingAddress,
} from "../validators/customerValidator.js";
import { handleValidationErrors } from "../middlewares/validation.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateCreateCustomer,
  handleValidationErrors,
  createCustomer
);

router.get("/profile", authenticate, getCustomerProfile);

router.get("/orders", authenticate, getCustomerOrders);

router.put(
  "/profile",
  authenticate,
  validateUpdateProfile,
  handleValidationErrors,
  updateCustomerProfile
);

router.post(
  "/shipping-addresses",
  authenticate,
  validateAddShippingAddress,
  handleValidationErrors,
  addShippingAddress
);

router.put(
  "/shipping-addresses/:addressId",
  authenticate,
  validateUpdateShippingAddress,
  handleValidationErrors,
  updateShippingAddress
);

router.put(
  "/billing-address",
  authenticate,
  validateSetBillingAddress,
  handleValidationErrors,
  setBillingAddress
);

export default router;
