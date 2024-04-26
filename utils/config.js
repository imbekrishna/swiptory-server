const dotenv = require("dotenv");
// const logger = require("./logger");

// Configure environment variables. On error shutdown the server
dotenv.config();
/*
if (status.error) {
  logger.error("Error configuring env variables")
  logger.error(status.error)
  process.exit(1)
}
*/

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
