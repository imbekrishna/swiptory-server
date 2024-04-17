const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user.model.js");

/**
 * Auth controller to validate user and generate jwt token
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const loginUser = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  const { username, password } = request.body;

  /**
   * @type {User|null}
   */
  const user = await User.findOne({ username }).select("username password");

  if (!user) {
    return response.status(400).json({ error: "Invalid username/password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return response.status(400).json({ error: "Invalid username/password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: "14d",
    }
  );

  response.status(200).json({
    message: "Logged in successfully",
    data: { id: user._id, username: user.username, token },
  });
};

module.exports = {
  loginUser,
};
