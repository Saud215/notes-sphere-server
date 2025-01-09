import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import {
  validateLoginUserInput,
  validateRegisterUserInput,
} from "../middlewares/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegisterUserInput, registerUser);
router.post("/login", validateLoginUserInput, loginUser);
router.get("/logout", logoutUser);

export default router;
