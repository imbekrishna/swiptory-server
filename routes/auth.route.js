/**
 * Express router instance for Auth endpoints
 */
const authRouter = require("express").Router();
const authController = require("../controllers/auth.controller.js");
const { loginValidator } = require("../utils/validators.js");

authRouter.post("/login", loginValidator, authController.loginUser);

module.exports = authRouter;
