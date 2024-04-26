// imports
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("../utils/config");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");
const userRouter = require("../routes/user.route");
const authRouter = require("../routes/auth.route");
const storyRouter = require("../routes/story.route");
const categoryRouter = require("../routes/category.route");

// mongodb | mongoose connection
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to the DB"))
  .catch((err) => {
    logger.error("Error connecting to the DB");
    logger.error(err);
    process.exit(1);
  });

const app = express();

// express app configs
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.requestLogger);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Swipstory server",
    status: "RUNNING",
    time: new Date(),
  });
});

// App routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/story", storyRouter);
app.use("/api/category", categoryRouter);

// Error handling middlewares
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

if (process.env.NODE_ENV === "production") {
  app.listen();
}

module.exports = app;