import { validationResult, body, param } from "express-validator";

import Note from "../models/Note.js";
import User from "../models/User.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/customErrors.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        const errors = result.array().map((obj) => obj.msg);
        console.log(errors);

        if (errors[0].startsWith("Sorry, but no resource found")) {
          throw new NotFoundError(errors[0]);
        }
        throw new BadRequestError(errors);
      }
      next();
    },
  ];
};

export const validateNoteInput = withValidationErrors([
  body("title")
    .notEmpty()
    .withMessage("Every note must have a title in it!")
    .isLength({ min: 3, max: 48 })
    .withMessage("The length of the title must be between 3 to 48 characters!")
    .trim(),
  body("text")
    .notEmpty()
    .withMessage("Every note must have some text in it!")
    .isLength({ min: 1, max: 1024 })
    .withMessage("The text of note must be between 1 to 1024 characters long!")
    .trim(),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a Boolean value!"),
]);

export const validateIdParam = withValidationErrors([
  param("id")
    .isMongoId()
    .withMessage("Invalid DB id!")
    .custom(async (id) => {
      const note = await Note.findById(id);
      const user = await User.findById(id);
      if (!note && !user)
        throw new NotFoundError(
          `Sorry, but no resource found with the id: ${id}`
        );
    }),
]);

export const validateRegisterUserInput = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage("Username is required!")
    .isLength({ min: 3, max: 14 })
    .withMessage("Username length should be between 3 to 14 characters long!")
    .isAlphanumeric()
    .withMessage("Only numbers and alphabets are allowed!")
    .custom(async (username) => {
      const user = await User.findOne({ username });

      if (user)
        throw new BadRequestError(
          "Entered username already exists, please enter a new unique username!"
        );
    })
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .custom(async (email) => {
      const user = await User.findOne({ email });

      if (user)
        throw new BadRequestError(
          "Entered email already exists, please enter a new unique email!"
        );
    })
    .isLowercase()
    .withMessage("Only lowercase is allowed for the email!")
    .normalizeEmail()
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters long!")
    .trim(),
  // a good practice is to add a confirm password input also with unique email and username
]);

export const validateLoginUserInput = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage("Username is required!")
    .isLength({ min: 3, max: 24 })
    .withMessage("Username length should be between 3 to 24 characters long!")
    .isAlphanumeric()
    .withMessage("Only numbers and alphabets are allowed!")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters long!")
    .trim(),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty!")
    .isLength({ min: 3, max: 24 })
    .withMessage("Username length should be between 3 to 24 characters long!")
    .isAlphanumeric()
    .withMessage("Only numbers and alphabets are allowed!")
    .custom(async (username) => {
      const user = await User.findOne({ username });

      if (user)
        throw new BadRequestError(
          "Entered username already exists, please enter a new unique username!"
        );
    })
    .trim()
    .optional(),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .isLowercase()
    .withMessage("Only lowercase is allowed for the email!")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });

      if (user && user._id.toString() !== req.user.userId)
        throw new BadRequestError(
          "Entered email already exists, please enter a new unique email!"
        );
    })
    .normalizeEmail()
    .trim()
    .optional(),
  body("isActive")
    .notEmpty()
    .withMessage("A user should be either active or inactive!")
    .isBoolean()
    .withMessage("The active flag can only hold a boolean value!")
    .optional(),
  param("id")
    .isMongoId()
    .withMessage("Invalid DB id!")
    .custom(async (id, { req }) => {
      if (req.user.userId !== id)
        throw new ForbiddenError(
          "You are not allowed to update another user's profile!"
        );
    }),
]);
// ownerShip validation n?
