/**
 * Express router instance for User endpoints
 */
const userRouter = require("express").Router();

const validators = require("../utils/validators");
const userController = require("../controllers/user.controller.js");

userRouter.get("/", (request, response) => {
  response.status(200).json({ message: "User found" });
});

userRouter.post("/", validators.signupValidator, userController.createUser);

module.exports = userRouter;
