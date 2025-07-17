import Tag from "../models/Tag.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const getAllTags = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const filter = {};
    if (search) {
      filter.search = search;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === true;
    }
    const tags = await Tag.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Tag.countDocuments(filter);
    res.json({
      success: true,
      data: {
        tags,
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

export const getTagsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format." });
    }
    const tag = await Tag.findById(id);
    if (!tag) {
      return res
        .status(404)
        .json({ success: false, message: "Tag not found." });
    }
    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true,
    });
    res.json({
      success: true,
      data: { tag: { ...tag.toObject(), productCount } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    const tag = new Tag({ name, color: color || "#000000" });
    await tag.save();
    res.status(201).json({
      success: true,
      message: "Tag created successfully.",
      data: { tag },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const tag = await Tag.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!tag) {
      return res
        .status(404)
        .json({ success: false, message: "tag not found." });
    }
    res.json({
      success: true,
      message: "Tag updated successfully.",
      data: { tag },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return res
        .status(404)
        .json({ success: false, message: "Tags not found." });
    }
    await Product.updateMany({ tags: id }, { $pull: { tags: id } });
    res.json({ success: true, message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
