const mongoose = require("mongoose");

/**
 * Mongoose schema for Category
 * @type {import('mongoose').Schema<Category>}
 */
const CategorySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

/**
 * @typedef {import('mongoose').Model<import('mongoose').Document & Category>} CategoryModel
 */

/**
 * @type {CategoryModel}
 */

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

module.exports = Category;
