import User from "../models/Auth.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      const err = new Error("Please fill all the fields");
      err.statusCode = 400;
      return next(err);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const err = new Error("Please fill all the fields");
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      return next(err);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export { registerUser, loginUser, getUserInfo };
