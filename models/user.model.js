const mongoose = require("mongoose");
/**
 * Mongoose schema for User
 * @type {import('mongoose').Schema<User>}
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 3,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    stories: [
      { type: mongoose.Schema.Types.ObjectId, default: [], ref: "Story" },
    ],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef {import('mongoose').Model<import('mongoose').Document & User>} UserModel
 */

/**
 * @type {UserModel}
 */
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
