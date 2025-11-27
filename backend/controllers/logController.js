import Log from "../models/Log.js";
import Item from "../models/Item.js";

const getAllLogs = async (req, res, next) => {
  try {
    const { name } = req.query;
    let filter = {};

    if (name) {
      const item = await Item.findOne({
        name: { $regex: name, $options: "i" },
      });

      if (!item) {
        const err = new Error(`No item found with name matching "${name}"`);
        err.statusCode = 404;
        return next(err);
      }

      filter.itemId = item._id;
    }

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .populate("itemId", "name category quantity");
    res.status(200).json({
      data: logs,
      status: name ? `Filtered by item name: ${name}` : "All logs",
    });
  } catch (error) {
    next(error);
  }
};

const getLogsByItemId = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const logs = await Log.find({ itemId }).sort({ timestamp: -1 });

    res.status(200).json({
      data: logs,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export { getAllLogs, getLogsByItemId };
