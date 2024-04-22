/**
 * Express router instance for User endpoints
 */
const userRouter = require("express").Router();

const validators = require("../utils/validators");
const userController = require("../controllers/user.controller.js");
const { verifyToken, getLoggedUser } = require("../utils/middleware");

userRouter.get(
  "/stories",
  verifyToken,
  getLoggedUser,
  userController.getUserStories
);

userRouter.get("/:username", userController.getUser);

userRouter.post("/", validators.signupValidator, userController.createUser);

module.exports = userRouter;
