import mongoose from "mongoose";

const inventoryHistorySchema = new mongoose.Schema(
  {
    //product, quantityChange, previousStock, newStock, reason, reference, changedBy
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      enum: ["order", "restock", "adjustment", "return"],
      required: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryHistory = mongoose.model(
  "InventoryHistory",
  inventoryHistorySchema
);
export default InventoryHistory;
