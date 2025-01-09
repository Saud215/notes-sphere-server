import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userController.js";
import {
  validateIdParam,
  validateUpdateUserInput,
} from "../middlewares/validationMiddleware.js";
import adminRoute from "../middlewares/adminRouteMiddleware.js";

const router = Router();

router.get("/", [adminRoute], getAllUsers); // admin route
router.get("/current-user", getCurrentUser); //user route
router.patch(
  "/update-user/:id",
  [validateIdParam, validateUpdateUserInput],
  updateCurrentUser
); //user route
router.delete("/delete-user/:id", [adminRoute, validateIdParam], deleteUser); // admin route

export default router;
