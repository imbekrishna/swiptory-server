/**
 * Express router instance for Stiry endpoints
 */
const storyRouter = require("express").Router();

const storyController = require("../controllers/story.controller.js");
const { verifyToken, getLoggedUser } = require("../utils/middleware.js");
const { storyValidator } = require("../utils/validators.js");

storyRouter.get("/", storyController.getAllStories);
storyRouter.get("/:storyId", storyController.getStoryById);
storyRouter.post(
  "/",
  storyValidator,
  verifyToken,
  getLoggedUser,
  storyController.createStory
);

storyRouter
  .route("/:storyId")
  .put(verifyToken, getLoggedUser, storyValidator, storyController.updateStory)
  .delete(verifyToken, getLoggedUser, storyController.deleteStoryById);

storyRouter.patch(
  "/like/:storyId",
  verifyToken,
  getLoggedUser,
  storyController.likeStory
);

storyRouter.patch(
  "/bookmark/:storyId",
  verifyToken,
  getLoggedUser,
  storyController.bookmarkStory
);

module.exports = storyRouter;
