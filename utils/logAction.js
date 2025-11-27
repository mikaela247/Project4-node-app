import Log from "../models/Log.js";

const logAction = async (
  actionType,
  itemId,
  changes = {},
  description = "",
  userId
) => {
  try {
    await Log.create({
      action: actionType,
      itemId,
      userId,
      changes,
      description,
    });
  } catch (error) {
    console.error("failed to log action:", error);
  }
};

export default logAction;
