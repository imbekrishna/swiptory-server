const { validationResult } = require("express-validator");
const Story = require("../models/story.model.js");
const User = require("../models/user.model.js");
const ObjectId = require("mongoose").mongo.ObjectId;

/**
 * Story controller to list all the stories in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const getAllStories = async (request, response) => {
  const stories = await Story.find({});

  response.status(200).json({ message: "All stories", data: stories });
};

/**
 * Story controller to list a single story in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const getStoryById = async (request, response) => {
  const storyId = request.params.storyId;

  const stories = await Story.findOne({ _id: storyId });

  response.status(200).json({ message: `Story id: ${storyId}`, data: stories });
};

/**
 * Story controller to create new story in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const createStory = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  /**
   * Logged user object
   * @type {User}
   */
  const activeUser = request.activeUser;

  /**
   * @type {Story}
   */
  const newStory = await Story.create({
    ...request.body,
    user: activeUser._id,
  });

  activeUser.stories.push(newStory._id);
  await activeUser.save();

  response.status(201).json(newStory);
};
/**
 * Story controller to update a story in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
const updateStory = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  const storyId = request.params.storyId;

  /**
   * Logged user object
   * @type {User}
   */
  const activeUser = request.activeUser;

  /**
   * @type {Story}
   */
  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return response
      .status(404)
      .json({ message: `No story with id: ${storyId}` });
  }

  /**
   * @type {import("mongoose").mongo.ObjectId}
   */
  const storyUser = new ObjectId(story.user);

  if (!storyUser.equals(activeUser._id)) {
    return response
      .status(400)
      .json({ message: "You are not authorized to perform this action" });
  }

  const updatedStory = await Story.updateOne(
    { _id: storyId },
    { ...request.body, user: activeUser._id },
    {
      new: true,
    }
  );

  response
    .status(200)
    .json({ message: "Story updated successfully.", data: updatedStory });
};

/**
 * Story controller to like a story in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
const likeStory = async (request, response, next) => {
  const storyId = request.params.storyId;

  /**
   * Logged user object
   * @type {User}
   */
  const activeUser = request.activeUser;

  const session = await User.startSession();
  session.startTransaction();
  try {
    await User.updateOne({ _id: activeUser._id }, [
      {
        $set: {
          likes: {
            $cond: [
              {
                $in: [storyId, "$likes"],
              },
              {
                $setDifference: ["$likes", [storyId]],
              },
              {
                $concatArrays: ["$likes", [storyId]],
              },
            ],
          },
        },
      },
    ]);

    await Story.updateOne({ _id: storyId }, [
      {
        $set: {
          likes: {
            $cond: [
              {
                $in: [activeUser._id, "$likes"],
              },
              {
                $setDifference: ["$likes", [activeUser._id]],
              },
              {
                $concatArrays: ["$likes", [activeUser._id]],
              },
            ],
          },
        },
      },
    ]);

    await session.commitTransaction();
    session.endSession();
    response.status(201).json({ message: "Likes updated" });
  } catch (error) {
    response.status(422).json({ message: "Failed to update likes" });
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// TODO: Add bookmark route
/**
 * Story controller to bookmark a story
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express response object
 */
const bookmarkStory = async (request, response) => {
  const storyId = request.params.storyId;

  /**
   * @type {User}
   */
  const activeUser = request.activeUser;

  await User.updateOne({ _id: activeUser._id }, [
    {
      $set: {
        bookmarks: {
          $cond: [
            {
              $in: [storyId, "$bookmarks"],
            },
            {
              $setDifference: ["$bookmarks", [storyId]],
            },
            {
              $concatArrays: ["$bookmarks", [storyId]],
            },
          ],
        },
      },
    },
  ]);

  response.status(200).json({
    message: "Bookmark updated",
  });
};

/**
 * Story controller to delete a story in the database
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const deleteStoryById = async (request, response) => {
  const storyId = request.params.storyId;

  /**
   * @type {User}
   */
  const activeUser = request.activeUser;

  /**
   * @type {Story}
   */
  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return response
      .status(404)
      .json({ message: `No story with id: ${storyId}` });
  }

  /**
   * @type {import("mongoose").mongo.ObjectId}
   */
  const storyUser = new ObjectId(story.user);

  if (!storyUser.equals(activeUser._id)) {
    return response
      .status(400)
      .json({ message: "You are not authorized to perform this action" });
  }

  await Story.findOneAndDelete({ _id: storyId });

  /**
   * @type {import("mongoose").mongo.ObjectId}
   */
  const storyIdObject = new ObjectId(storyId);
  const filteredStories = activeUser.stories.filter((s) =>
    storyIdObject.equals(s)
  );
  activeUser.stories = filteredStories;

  await activeUser.save();

  response.status(204).json({ message: "Story deleted successfully" });
};

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  likeStory,
  updateStory,
  deleteStoryById,
  bookmarkStory,
};
