const { body } = require("express-validator");

/**
 * Validator for req body fields
 */
const signupValidator = [
  body("username", "Username cannot be empty").notEmpty(),
  body("password", "Password cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),
];

const loginValidator = [
  body("username", "Username cannot be empty").notEmpty(),
  body("password", "Password cannot be empty").notEmpty(),
];

const storyValidator = [
  body("category").notEmpty(), // TODO: Add enum validation
  body("slides.*.heading").notEmpty().isLength({ min: 5 }),
  body("slides.*.description").notEmpty().isLength({ min: 10 }),
  body("slides.*.imageUrl").notEmpty().isURL(),
];

module.exports = {
  signupValidator,
  loginValidator,
  storyValidator,
};
