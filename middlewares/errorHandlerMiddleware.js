import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  console.error(err.stack);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something went wrong, Please try again later!";

  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
