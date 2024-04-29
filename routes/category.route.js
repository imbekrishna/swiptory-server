/**
 * Express router instance for Category endpoints
 */
const categoryRouter = require("express").Router();
const {
  getCategories,
  // addCategory,
} = require("../controllers/category.controller");

categoryRouter.get("/", getCategories);
// categoryRouter.post("/", addCategory);

module.exports = categoryRouter;
