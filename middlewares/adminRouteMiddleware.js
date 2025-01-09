import { ForbiddenError } from "../errors/customErrors.js";

const adminRouteMiddleware = (req, res, next) => {
  const { role } = req.user;

  if (role === "user")
    throw new ForbiddenError("You are not allowed to access this resource!");
  next();
};

export default adminRouteMiddleware;
