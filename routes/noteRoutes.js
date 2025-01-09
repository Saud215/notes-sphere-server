import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/noteController.js";
import {
  validateIdParam,
  validateNoteInput,
} from "../middlewares/validationMiddleware.js";
import ownershipChecker from "../middlewares/ownershipCheckerMiddleware.js";

const router = Router();

router.route("/").get(getAllNotes).post([validateNoteInput], createNote);
router
  .route("/:id")
  .get([validateIdParam, ownershipChecker], getNote)
  .patch([validateIdParam, ownershipChecker, validateNoteInput], updateNote)
  .delete([validateIdParam, ownershipChecker], deleteNote);

export default router;
