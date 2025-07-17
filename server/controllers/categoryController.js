import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const filter = {};
    if (search) {
      filter.search = search;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === true;
    }
    const categories = await Category.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Category.countDocuments(filter);
    res.json({
      success: true,
      data: {
        categories,
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

export const getCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format." });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true,
    });
    res.json({
      success: true,
      data: { category: { ...category.toObject(), productCount } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/[^a-z0-9]+/g, "");
    const category = new Category({ name, description, slug });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.name) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/[^a-z0-9]+/g, "");
    }
    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found." });
    }
    res.json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing products.",
      });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
