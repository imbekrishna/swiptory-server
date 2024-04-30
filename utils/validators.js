const { body } = require("express-validator");

/**
 * Validator for req body fields
 */
const signupValidator = [
  body("username", "Username cannot be empty").notEmpty().trim(),
  body("password", "Password cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),
];

const loginValidator = [
  body("username", "Username cannot be empty").notEmpty().trim(),
  body("password", "Password cannot be empty").notEmpty(),
];

const storyValidator = [
  body("category").notEmpty().withMessage("Category required empty"),
  body("slides.*.heading").notEmpty().withMessage("Heading required"),
  body("slides.*.description").notEmpty().withMessage("Description required"),
  body("slides.*.imageUrl")
    .notEmpty()
    .isURL()
    .withMessage("Valid url required"),
];

module.exports = {
  signupValidator,
  loginValidator,
  storyValidator,
};
