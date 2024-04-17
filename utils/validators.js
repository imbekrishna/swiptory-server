const { body } = require("express-validator");

/**
 * Validator for req body fields
 */
const signupValidator = [
  body("username", "Username cannot be empty").notEmpty(),

  /* Anything with less than eight characters OR anything with no numbers OR anything with no uppercase OR or anything with no lowercase OR anything with no special characters is a valid password */

  body("password", "Invalid password")
    .not()
    .matches(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/)
    .withMessage(
      "Password must be at least 8 characters long and contain a lowercase letter, an uppercase letter, a number and a special character"
    ),
];

const loginValidator = [
  body("username", "Username cannot be empty").notEmpty(),
  body("password", "Password cannot be empty").notEmpty(),
];

const storyValidator = [
  body("category").notEmpty(), // TODO: Add enum validation
  body("slides.*.heading").notEmpty().isLength({ min: 5, max: 30 }),
  body("slides.*.description").notEmpty().isLength({ max: 256 }),
  body("slides.*.imageUrl").notEmpty().isURL(),
];

module.exports = {
  signupValidator,
  loginValidator,
  storyValidator,
};
