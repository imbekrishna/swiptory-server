const { validationResult } = require("express-validator");
const Story = require("../models/story.model.js");
const User = require("../models/user.model.js");

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
 * Story controller to list all the stories in the database
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
 * Story controller to create new story in the database
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

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  likeStory,
};
