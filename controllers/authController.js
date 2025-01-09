import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import { UnauthorizedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const isFirstUser = (await User.countDocuments()) === 0;
  req.body.role = isFirstUser ? "admin" : "user";

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: `User created with username: ${username}` });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).exec();

  const validToLogin =
    user && (await comparePasswords(password, user.password));

  if (!validToLogin)
    throw new UnauthorizedError("Please provide valid credentials!");

  const token = createJWT({ userId: user._id, role: user.role });

  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: oneDay,
    // sameSite: "None",
    // ,  Optional, to enhance CSRF protection
  });

  const formattedUser = user.withoutPassword();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Welcome user: ${username} `,
    user: formattedUser,
  });
};
export const logoutUser = (req, res) => {
  const { token } = req.cookies;
  if (!token)
    return res
      .status(StatusCodes.NO_CONTENT)
      .json({ success: true, msg: "User logged out!" });

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    sameSite: "strict", // Optional, to enhance CSRF protection
  });

  res.status(StatusCodes.OK).json({ success: true, msg: "Logged out!" });
};
