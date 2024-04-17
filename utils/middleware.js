const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const logger = require("./logger");

/**
 * Express middleware for verifying authorization token.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */

const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization?.replace("Bearer ", "");

  if (!authToken) {
    return res.status(400).json({ message: "Authorization token missing." });
  }

  const payload = jwt.verify(authToken, process.env.SECRET_KEY);

  req.activeUserId = payload.id;

  next();
};

/**
 * Express middleware for fetching user from jwt token id.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */

const getLoggedUser = async (req, res, next) => {
  const id = req.activeUserId;

  const loggedUser = await User.findById(id);

  req.activeUser = loggedUser;

  next();
};

/**
 * Express middleware for catching unknown endpoints
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express response object
 */
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unkonwn endpoint" });
};

/**
 * Express middleware for error handling
 * @param {Error} error - The error thrown
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express response object
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  verifyToken,
  getLoggedUser,
  errorHandler,
  unknownEndpoint,
};
