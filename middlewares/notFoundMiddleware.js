import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req, res) => {
  res.status(StatusCodes.NOT_FOUND);

  if (req.accepts("json")) {
    res.json({ msg: "404, resource not found" });
  } else {
    res.send("404, resource not found");
  }
};

export default notFoundMiddleware;
