/**
 * @typedef {Object} User
 * @property {string} _id - Id of the user.
 * @property {string} username - username of the user.
 * @property {string} password - Password of the user.
 * @property {Array<string>} [stories] - Array of Ids of stories created by the user
 * @property {Array<string>} [bookmarks] - Array of Ids of bookmarked stories
 * @property {Array<string>} [likes] - Array of Ids of liked stories
 * @memberof typedefs
 */

/**
 * @typedef {Object} StorySlide
 * @property {string} heading - Heading text of the slide
 * @property {string} description - Description text of the slide
 * @property {string} imageUrl - Url of the background image of the slide
 */

/**
 * @typedef {Object} Story
 * @property {string} _id - Id of the story.
 * @property {string} user - Id of the user of story.
 * @property {string} category - Category of the story.
 * @property {Array<StorySlide>} slides - Array of slides of the story
 * @property {Array<string>} [likes] - Array of id of the users liking the story
 * @memberof typedefs
 */

/**
 * @typedef {Object} Category
 * @property {string} _id - Id of the category.
 * @property {string} name - Name of the category.
 * @property {string} imageUrl - Image of the category.
 */
