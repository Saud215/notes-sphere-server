import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

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
  const updatedUser = req.body;

  if (req.file) {
    const resp = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(resp);
    await fs.unlink(req.file.path);
    updatedUser.avatar = resp.secure_url;
    updatedUser.avatarPublicId = resp.public_id;
  }

  // exec() returns a promise from a mongoose thenable
  const user = await User.findByIdAndUpdate(id, updatedUser).exec();

  if (req.file && user.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(user.avatarPublicId);
  }

  const formattedUser = user.withoutPassword();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "User Updated Successfully!",
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
