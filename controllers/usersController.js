import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { validate, validateID } from "../util/validate.js";

// @desc get all users
// @route GET /users
// @access Private
export const all = asyncHandler(async (req, res) => {
  const users = await User.find({
    $or: [
      { firstname: new RegExp(req.query.search, "i") },
      { lastname: new RegExp(req.query.search, "i") },
    ],
  })
    .select("-password")
    .lean();

  if (!users || !users.length) {
    return res.status(400).json({ message: "No Users Found" });
  }

  res.json(users);
});

// @desc create new user
// @route POST /users
// @access Private
export const create = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, roles } = req.body;

  const [isValid, errors] = validate(req.body, {
    firstname: "required|min:3|max:100",
    lastname: "required|min:3|max:100",
    email: "required|email",
    password: "required",
  });

  if (!isValid) return res.status(400).json({ validationErrors: errors });

  const duplicate = await User.findOne({ email }).lean().exec();

  if (duplicate)
    return res.status(409).json({ message: "This email already exist" });

  const user = await User.create({
    firstname,
    lastname,
    email,
    password: await bcrypt.hash(password, 10),
    roles,
  });

  if (user) res.status(201).json({ message: `New user ${firstname} created` });
  else res.status(400).json({ message: "Invalide user data received" });
});

// @desc update a user
// @route PATCH /users
// @access Private
export const update = asyncHandler(async (req, res) => {
  const { id, firstname, lastname, email, password, roles, active } = req.body;

  const [isValid, errors] = validate(req.body, {
    id: "required",
    firstname: "required|min:3|max:100",
    lastname: "required|min:3|max:100",
    email: "required|email",
    roles: "required|array.full",
    active: "required",
  });

  if (!isValid) return res.status(400).json({ validationErrors: errors });

  validateID(res, id);

  const user = await User.findById(id).exec();

  if (!user) return res.status(404).json({ message: "User Not Found" });

  const duplicate = await User.findOne({ email }).lean().exec();
  User.updateOne;

  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(409).json({ message: "This email already exist" });

  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  user.active = active;
  user.roles = roles;

  if (password) user.password = await bcrypt.hash(password, 10);

  const updatedUser = await user.save();

  res.status(200).json({ message: `user ${updatedUser.firstname} updated` });
});

// @desc delete a user
// @route DELETE /users
// @access Private
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) res.status(400).json({ message: "ID is required" });

  validateID(res, id);

  const user = User.findById(id).exec();

  if (!user) return res.status(404).json({ message: "User Not Found" });

  const deletedUser = await User.deleteOne({ _id: id });

  if (!deletedUser) res.status(400).json({ message: "Could not delete user" });

  res.status(200).json({ message: `User has ben deleted` });
});

// @desc delete a many users
// @route DELETE /users
// @access Private
export const destroy = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids.length) res.status(400).json({ message: "IDs is required" });

  const filtredIds = ids
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => mongoose.Types.ObjectId(id));

  const result = await User.deleteMany({ _id: { $in: filtredIds } });

  if (result.acknowledged)
    res.status(200).json({ message: `Users has ben deleted` });
  else res.status(400).json({ message: "Invalide user data received" });
});
