import { UnauthorizedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

const authenticationMiddleware = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    throw new UnauthorizedError(
      "Not authorized to view the resource, Please login!"
    );
  try {
    const tokenDecoded = verifyJWT(token);
    const { userId, role } = tokenDecoded;
    req.user = { userId, role };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthorizedError(
      "Not authorized to view the resource, Please login again!"
    );
  }
};

export default authenticationMiddleware;
