import { StatusCodes } from "http-status-codes";
import path from "path";

const notFoundMiddleware = (req, res) => {
  res.status(StatusCodes.NOT_FOUND);

  // if (req.accepts("html")) {
  //   res.sendFile(path.join(import.meta.dirname, "..", "views", "404.html"));
  // } else
  if (req.accepts("json")) {
    res.json({ msg: "404, resource not found" });
  } else {
    res.send("404, resource not found");
  }
};

export default notFoundMiddleware;
