const Category = require("../models/category.model");

/**
 * Catetory controller to get all categories
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const getCategories = async (request, response) => {
  const categories = await Category.find({});
  response.status(200).json({ message: "All categories", data: categories });
};

/**
 * Catetory controller to get all categories
 * @param {import('express').Request} request - Express request object.
 * @param {import('express').Response} response - Express response object
 * @returns {void}
 */
const addCategory = async (request, response) => {
  const category = await Category.create(request.body);

  response.status(201).json({ message: "Category created", data: category });
};

module.exports = {
  addCategory,
  getCategories,
};
