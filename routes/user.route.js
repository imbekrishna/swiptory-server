/**
 * Express router instance for User endpoints
 */
const userRouter = require("express").Router();

const userController = require("../controllers/user.controller.js");
const { verifyToken, getLoggedUser } = require("../utils/middleware");
const validators = require("../utils/validators");

userRouter.get(
  "/stories",
  verifyToken,
  getLoggedUser,
  userController.getUserStories
);

userRouter.get(
  "/bookmarks",
  verifyToken,
  getLoggedUser,
  userController.getUserBookmarks
);

userRouter.get("/:username", userController.getUser);

userRouter.post("/", validators.signupValidator, userController.createUser);

module.exports = userRouter;
