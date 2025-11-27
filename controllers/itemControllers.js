import Item from "../models/Item.js";
import logAction from "../utils/logAction.js";

const getItems = async (req, res, next) => {
  try {
    const { category, name } = req.query;
    const filter = { isDeleted: false };
    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });

    const responseObj = {
      data: items,
      results: items.length,
      status: name
        ? `Filtered by name: ${name}`
        : category
        ? `Filtered by category: ${category}`
        : "fetch all data",
    };
    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const getItemsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item || item.isDeleted) {
      const err = new Error("Item not found");
      err.statusCode = 404;
      return next(err);
    }

    const responseObj = {
      data: item,
      status: "success",
      message: "Item fetched successfully",
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const addNewItem = async (req, res, next) => {
  try {
    const { name, quantity, unit, category } = req.body;
    if (!name || !quantity || !unit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = new Item({ name, quantity, unit, category });
    await newItem.save();

    await logAction(
      "add",
      newItem._id,
      { after: req.body },
      `Added item: ${newItem.name}`,
      req.user._id
    );

    res.status(201).json({
      data: newItem,
      status: "success",
      message: "Item added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingItem = await Item.findOne({ _id: id, isDeleted: false });
    if (!existingItem) {
      const err = new Error(`No active item found with id: ${id}`);
      err.statusCode = 404;
      return next(err);
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    await logAction(
      "update",
      id,
      { before: existingItem, after: updatedItem },
      `Updated item: ${existingItem.name}`,
      req.user._id
    );

    res.status(200).json({
      data: updatedItem,
      status: "success",
      message: "Item updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const softDeletedItem = await Item.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!softDeletedItem) {
      const err = new Error(`No item found with id: ${id}`);
      err.statusCode = 404;
      return next(err);
    }

    await logAction(
      "delete",
      id,
      { before: softDeletedItem },
      `Soft deleted item: ${softDeletedItem.name}`,
      req.user._id
    );

    res.status(200).json({
      data: softDeletedItem,
      status: "success",
      message: "Item soft deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export {
  getItems,
  getItemsById,
  addNewItem,
  updateItemById,
  softDeleteItemById,
};
