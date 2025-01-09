import { ForbiddenError } from "../errors/customErrors.js";
import Note from "../models/Note.js";
import User from "../models/User.js";

const ownershipCheckerMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const note = await Note.findById(id);

  const { userId, role } = req.user;

  const isAdmin = role === "admin";
  const isOwner = note.createdBy.toString() === userId;

  if (!isAdmin && !isOwner)
    throw new ForbiddenError("You are forbidden from accessing this resource!");

  next();
};

export default ownershipCheckerMiddleware;
