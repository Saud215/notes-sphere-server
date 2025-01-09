import { StatusCodes } from "http-status-codes";
import Note from "../models/Note.js";
import User from "../models/User.js";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllNotes = async (req, res) => {
  const notes = await Note.find({ createdBy: req.user.userId }).lean();

  if (notes.length < 1)
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Sorry , But No Notes Found in the Database !",
      notes: [],
    });

  res.status(StatusCodes.OK).json({ success: true, notes });
};

export const createNote = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const note = await Note.create(req.body);

  res.status(StatusCodes.CREATED).json({ success: true, note });
};

export const getNote = async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id).lean().exec();

  res.status(StatusCodes.OK).json({ success: true, note });
};

export const updateNote = async (req, res) => {
  const { id } = req.params;

  const note = await Note.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .lean()
    .exec();

  res.status(StatusCodes.OK).json({ success: true, note });
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  const deletedNote = await Note.findByIdAndDelete(id).lean().exec();

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Note Deleted Successfully!" });
};
