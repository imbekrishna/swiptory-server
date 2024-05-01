/**
 * Express router instance for Auth endpoints
 */
const authRouter = require("express").Router();

const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const { loginValidator, signupValidator } = require("../utils/validators.js");

authRouter.post("/login", loginValidator, authController.loginUser);
authRouter.post("/register", signupValidator, userController.createUser);

module.exports = authRouter;
