/**
 * Express router instance for Category endpoints
 */
const categoryRouter = require("express").Router();

const { getCategories } = require("../controllers/category.controller");

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
