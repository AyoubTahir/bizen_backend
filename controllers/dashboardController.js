import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
// @desc get all models count
// @route GET /dashboard
// @access Private
export const counts = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    totalUsers,
    totalProducts,
  });
});
