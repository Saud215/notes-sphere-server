import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

import corsOptions from "./utils/corsUtils.js";

import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notFound from "./middlewares/notFoundMiddleware.js";
import errorHandler from "./middlewares/errorHandlerMiddleware.js";
import authenticateUser from "./middlewares/authenticationMiddleware.js";

// backend chapters 8 and 12 sums up to just two lessons
// one is the usage of two tokens method for the auth with new status code like 204/409 noContent/conflict
// and new custom hooks build with useEffect to make the document title dynamic.

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// server routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", authenticateUser, noteRoutes);
app.use("/api/v1/users", authenticateUser, userRoutes);

// Server Landing Page
app.use(express.static(path.join(import.meta.dirname, "public")));
app.get("*", (req, res) => {
  res
    .status(StatusCodes.OK)
    .sendFile(path.join(import.meta.dirname, "public", "index.html"));
});

app.get("/testing", (req, res) => {
  res.status(StatusCodes.OK).json({ success: true, msg: "Welcome" });
});

// not found middleware
app.all("*", notFound);
// error handler middleware
app.use(errorHandler);

// connection to DB and hosting on local machine
try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Successfully connected to DB! ");

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on the port ${process.env.PORT || 5000}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
