import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    //filter object
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    if (tags) {
      filter.tags = tags;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        {
          title: { $regex: search, $options: "i" },
          description: { $regex: search, $options: "i" },
        },
      ];
    }

    //Sort object
    const sort = {};
    sort[sortBy] = sortOrder == "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("tags", "name color")
      .populate("createdBy", "username")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format." });
    }
    const product = await Product.findById(id)
      .populate("category", "name slug description")
      .populate("tags", "name color")
      .populate("createdBy", "username");

    if (!product) {
      res.status(404).json({ success: false, message: "Products not found." });
    }
    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, price, imageURL, description, category, tags, stock } =
      req.body;
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      //Later we will add the functionality of adding the category if not exists.
      return res
        .status(400)
        .json({ success: false, message: "Category not found." });
    }
    if (tags && tags.length > 0) {
      const tagCount = await Tag.countDocuments({ _id: { $in: tags } });
      if (tagCount !== tags.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more tags found." });
      }
    }
    const product = new Product({
      title,
      price,
      imageURL,
      description,
      category,
      tags: tags || [],
      stock: stock || 0,
      createdBy: req.user._id,
    });
    await product.save();
    await product.populate("category", "name slug");
    await product.populate("tags", "name color");
    await product.populate("createdBy", "username");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    const isOwner = product.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products.",
      });
    }
    if (
      updates.category &&
      !mongoose.Types.ObjectId.isValid(updates.category)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    }
    const categoryExists = await Category.findById(updates.category).lean(); //THis is a testing feature to check if it improves performance by not hydrating mongoose documents.
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "category not found." });
    }

    if (updates.tags && Array.isArray(updates.tag) && updates.tags.length > 0) {
      const tagCount = await Tag.countDocuments({ _id: { $in: updates.tags } });
      if (tagCount !== updates.tags.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more tags not found." });
      }
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate("tags", "name color")
      .populate("createdBy", "username");

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    //check if that's the user's product
    if (
      product.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products.",
      });
    }
    await Product.findByIdAndDelete(id);
    res.json({ success: false, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
