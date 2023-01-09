import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { validate, validateID } from "../util/validate.js";

// @desc get all products
// @route GET /products
// @access Private
export const all = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("user", "firstname lastname -_id")
    .select("-__v -updatedAt")
    .lean();

  if (!products?.length)
    return res.status(200).json({ message: "No Products Found" });

  res.status(200).json(products);
});

// @desc create new product
// @route POST /products
// @access Private
export const create = asyncHandler(async (req, res) => {
  const { user_id, name, description, cost, price } = req.body;

  const [isValid, errors] = validate(req.body, {
    user_id: "required",
    name: "required",
    description: "required",
    cost: "required|number",
    price: "required|number",
  });

  if (!isValid) return res.status(400).json({ validationErrors: errors });

  validateID(res, user_id);

  const user = await User.findById(user_id).lean().exec();

  if (!user) return res.status(404).json({ message: "User not found" });

  const product = await Product.create({
    user: user_id,
    name,
    description,
    cost,
    price,
  });

  if (product)
    return res.status(201).json({ message: `Product ${product.name} Created` });
  else
    return res.status(400).json({ message: "Invalide product data received" });
});

// @desc update product
// @route PATCH /products
// @access Private
export const update = asyncHandler(async (req, res) => {
  const { user_id, id, name, description, cost, price } = req.body;

  const [isValid, errors] = validate(req.body, {
    id: "required",
    user_id: "required",
    name: "required",
    description: "required",
    cost: "required|number",
    price: "required|number",
  });

  if (!isValid) return res.status(400).json({ validationErrors: errors });

  validateID(res, user_id);

  const user = await User.findById(user_id).lean().exec();

  if (!user) return res.status(404).json({ message: "User not found" });

  validateID(res, id);

  const product = await Product.findById(id).exec();

  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = name;
  product.description = description;
  product.cost = cost;
  product.price = price;

  const updatedProduct = await product.save();

  if (updatedProduct)
    return res
      .status(200)
      .json({ message: `Product ${updatedProduct.name} Updated` });
  else
    return res.status(400).json({ message: "Invalide product data received" });
});

// @desc delete product
// @route DELETE /products
// @access Private
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) res.status(400).json({ message: "ID is required" });

  validateID(res, id);

  const product = await Product.findById(id).exec();

  if (!product) return res.status(404).json({ message: "Product Not Found" });

  const deletedProduct = await Product.deleteOne({ _id: id });

  if (!deletedProduct)
    res.status(400).json({ message: "Could not delete user" });

  res.status(200).json({ message: `Product has ben deleted` });
});
