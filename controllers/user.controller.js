const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const Story = require("../models/story.model.js");
const User = require("../models/user.model.js");

/**
 * User controller to create new User in the database
 * @type {ControllerFunction}
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
 * @type {ControllerFunction}
 */
const createUser = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const mappedErrors = [];
    errors.array().map((err) => mappedErrors.push(err.msg));
    return response.status(400).json({ error: mappedErrors.join("\n") });
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

/**
 * User controller to create new User in the database
 * @type {ControllerFunction}
 */
const getUserStories = async (request, response) => {
  const { page = 1, limit = 4 } = request.query;

  /**
   * Logged user object
   * @type {User}
   */
  const activeUser = request.activeUser;

  const query = { _id: { $in: activeUser.stories } };

  /**
   * @type {Story[]}
   */
  const stories = await Story.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit * 1);

  const count = await Story.find(query).count();

  return response.status(200).json({
    message: "User stories",
    data: stories,
    totalPages: Math.ceil(count / limit),
    currentPage: +page,
  });
};

/**
 * User controller to create new User in the database
 * @type {ControllerFunction}
 */
const getUserBookmarks = async (request, response) => {
  const { page = 1, limit = 4 } = request.query;

  /**
   * Logged user object
   * @type {User}
   */
  const activeUser = request.activeUser;

  const query = { _id: { $in: activeUser.bookmarks } };

  /**
   * @type {Story[]}
   */
  const stories = await Story.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit * 1);

  const count = await Story.find(query).count();

  return response.status(200).json({
    message: "User bookmarks",
    data: stories,
    totalPages: Math.ceil(count / limit),
    currentPage: +page,
  });
};

module.exports = {
  getUser,
  createUser,
  getUserStories,
  getUserBookmarks,
};
