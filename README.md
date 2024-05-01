# Swiptory - Stories on web (REST API)

A story sharing web platform.


## Features
  1. View stories
  2. Like stories
  3. Bookmark stories
  4. Share stories
  5. Filter by category
  6. Login and register
  7. Add stories
  8. Edit stories

### Links

- Live Site URL: [https://storybe.ishownow.uk/](https://storybe.ishownow.uk/)
- Client Repository: [swiptory-client](https://github.com/imbekrishna/swiptory-client)

### Built with

- [Express](https://expressjs.com/) - NodeJS webframework
- [MongoDB](https://www.mongodb.com/) - NoSQL Database
- [Mongoose](https://mongoosejs.com/) - ODM Library for MongoDB

### Endpoints

For AUTHORIZATION - `Authorization` header is required.

Example:
```http
POST {{baseUrl}}/story HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{authToken}}

# Body if any
{}
```

#### Story
| PATH               | METHOD | DESCRIPTION                          | AUTHORIZATION |
| ------------------ | ------ | ------------------------------------ | ------------- |
| /api/auth/login    | POST   | Get auth token for given credentials | NO            |
| /api/auth/register | POST   | Register a new user                  | NO            |


#### Story
| PATH                    | METHOD | DESCRIPTION         | AUTHORIZATION |
| ----------------------- | ------ | ------------------- | ------------- |
| /api/story              | GET    | Get all the stories | NO            |
| /api/story              | POST   | Create new story    | YES           |
| /api/story/:id          | GET    | Get a story         | NO            |
| /api/story/:id          | PUT    | Update a story      | YES           |
| /api/story/like/:id     | PATCH  | Like a story        | YES           |
| /api/story/bookmark/:id | PATCH  | Bookmark a story    | YES           |

Query params for `/api/story`:
| KEY      | DEFAULT | OPTIONS                                 |
| -------- | ------- | --------------------------------------- |
| category | {}      | FOOD, HEALTH, TRAVEL, MOVIES, EDUCATION |
| page     | 1       |                                         |
| limit    | 4       |                                         |

#### User
| PATH                | METHOD | DESCRIPTION                    | AUTHORIZATION |
| ------------------- | ------ | ------------------------------ | ------------- |
| /api/user           | POST   | Create a new user              | NO            |
| /api/user/stories   | POST   | Get stories created by user    | YES           |
| /api/user/bookmarks | POST   | Get stories bookmarked by user | YES           |

#### Category
| PATH          | METHOD | DESCRIPTION        | AUTHORIZATION |
| ------------- | ------ | ------------------ | ------------- |
| /api/category | GET    | Get all categories | NO            |

#### Misc
| PATH        | METHOD | DESCRIPTION            | AUTHORIZATION |
| ----------- | ------ | ---------------------- | ------------- |
| /api/health | GET    | Check status of server | NO            |