import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import User from "../models/User.js";
import { json } from "express";

export const getAllUsers = async (req, res) => {
  const users = await User.find({});

  if (users.length < 1)
    throw new NotFoundError("Sorry but no users to display!");

  const formattedUsers = users.map((user) => user.withoutPassword());

  res.status(StatusCodes.OK).json({ success: true, users: formattedUsers });
};
export const getCurrentUser = async (req, res) => {
  const { userId: id } = req.user;
  const user = await User.findById(id).exec();

  const formattedUser = user.withoutPassword();

  res.status(StatusCodes.OK).json({ success: true, user: formattedUser });
};

export const updateCurrentUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { username, email, isActive },
    {
      new: true,
    }
  ).exec();
  const formattedUser = user.withoutPassword();

  res.status(StatusCodes.OK).json({
    success: true,
    user: formattedUser,
  });
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id).exec();

  // const formattedUser = deletedUser.withoutPassword();

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: `deleted user: ${deletedUser.username}` });
};
