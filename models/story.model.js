const mongoose = require("mongoose");

/**
 * Mongoose schema for story slides
 * @type {import('mongoose').Schema<StorySlide>}
 */
const SlideSchema = mongoose.Schema(
  {
    heading: {
      type: String,
      minlength: 5,
      maxlength: 30,
      required: true,
    },
    description: {
      type: String,
      maxlength: 256,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/**
 * Mongoose schema for a story
 * @type {import('mongoose').Schema<Story>}
 */
const StorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    category: {
      type: String, // TODO: Either add enums or create new category model
      required: true,
    },
    slides: {
      type: [SlideSchema],
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef {import('mongoose').Model<import('mongoose').Document & Story>} StoryModel
 */

/**
 * @type {StoryModel}
 */
const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);

module.exports = Story;
