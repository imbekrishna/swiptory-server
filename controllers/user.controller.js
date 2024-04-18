const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/user.model.js");

/**
 * User controller to create new User in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const getUser = async (request, response) => {
  const username = request.params.username;

  const user = await User.findOne({ username });

  if (!user) {
    return response
      .status(404)
      .json({ message: `No user with username ${username} found` });
  }

  response.status(200).json({ message: "User found", data: user });
};

/**
 * User controller to create new User in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const createUser = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  const { username, password } = request.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return response.status(409).json({ error: "Username already taken." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  /**
   * @type {User}
   */
  const newUser = await User.create({
    username,
    password: passwordHash,
  });

  response.status(201).json({
    message: "User created",
    data: { id: newUser._id, username: newUser.username },
  });
};

module.exports = {
  getUser,
  createUser,
};
