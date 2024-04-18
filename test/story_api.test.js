import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import app, { response } from "../app";
import Story from "../models/story.model";
import User from "../models/user.model";

const api = supertest(app);

const user1 = {
  username: "imbekrishna",
  password: "Imbekrishna@234",
};
const user2 = {
  username: "bekrishna",
  password: "beKrishna@234",
};

const validStoryBody = {
  category: "movie",
  slides: [
    {
      heading: "Movie slide heading",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      imageUrl: "https://picsum.photos/id/27/300/400",
    },
    {
      heading: "Movie slide heading",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      imageUrl: "https://picsum.photos/id/28/300/400",
    },
    {
      heading: "Movie slide heading",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      imageUrl: "https://picsum.photos/id/29/300/400",
    },
  ],
};

const invalidStoryBody = {
  slides: [
    {
      heading: "Movie slide heading",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      imageUrl: "https://picsum.photos/id/27/300/400",
    },
    {
      heading: "Movie slide heading",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      imageUrl: "https://picsum.photos/id/28/300/400",
    },
    {
      heading: "Movie slide heading",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      imageUrl: "https://picsum.photos/id/29/300/400",
    },
  ],
};

describe("Story route", () => {
  let authToken1;
  let userId1;

  let authToken2;
  let userId2;

  let storyId;

  beforeAll(async () => {
    await Story.deleteMany({});
    await User.deleteMany({});

    await api.post("/api/user").send(user1);
    await api.post("/api/user").send(user2);

    const response1 = await api.post("/api/auth/login").send(user1);
    const loginData1 = response1.body.data;

    authToken1 = loginData1.token;
    userId1 = loginData1.id;

    const response2 = await api.post("/api/auth/login").send(user2);
    const loginData2 = response2.body.data;

    authToken2 = loginData2.token;
    userId2 = loginData2.id;
  });

  test("test always passes", () => {
    expect(true).toBeTruthy();
  });

  test("returns empty array when there are no stories", async () => {
    const response = await api.get("/api/story");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  test("creates story with valid data", async () => {
    const response = await api
      .post("/api/story")
      .send(validStoryBody)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.category).toBe(validStoryBody.category);

    const user = await User.findById({ _id: userId1 });
    const storiesArr = user.stories.map((story) => story.toString());

    expect(storiesArr).toContain(response.body.data._id);

    storyId = response.body.data._id;
  });

  test("retrieve story by id", async () => {
    const response = await api.get(`/api/story/${storyId}`);

    expect(response.statusCode).toBe(200);

    const message = new RegExp(`Story id: ${storyId}`, "i");

    expect(response.body.message).toMatch(message);
    expect(response.body.data.category).toBe(validStoryBody.category);
  });

  test("fails to creates story with invalid data", async () => {
    const response = await api
      .post("/api/story")
      .send(invalidStoryBody)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("updates story with same user", async () => {
    const udpatedBody = { ...validStoryBody, category: "food" };
    const response = await api
      .put(`/api/story/${storyId}`)
      .send(udpatedBody)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.category).toEqual(udpatedBody.category);
  });

  test("fails to update story with different user", async () => {
    const udpatedBody = { ...validStoryBody, category: "entertainment" };
    const response = await api
      .put(`/api/story/${storyId}`)
      .send(udpatedBody)
      .set({ authorization: `Bearer ${authToken2}` });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toMatch(
      /You are not authorized to perform this action/i
    );
  });

  test("liking story updates story and user", async () => {
    const response = await api
      .patch(`/api/story/like/${storyId}`)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toMatch(/likes updated/i);

    const user = await User.findById({ _id: userId1 });
    const story = await Story.findById({ _id: storyId });

    const userLikesArray = user.likes.map((storyId) => storyId.toString());
    const storyLikesArray = story.likes.map((userId) => userId.toString());

    expect(userLikesArray).toContain(storyId);
    expect(storyLikesArray).toContain(userId1);
  });

  test("unliking story updates story and user", async () => {
    const response = await api
      .patch(`/api/story/like/${storyId}`)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toMatch(/likes updated/i);

    const user = await User.findById({ _id: userId1 });
    const story = await Story.findById({ _id: storyId });

    const userLikesArray = user.likes.map((storyId) => storyId.toString());
    const storyLikesArray = story.likes.map((userId) => userId.toString());

    expect(userLikesArray).not.toContain(storyId);
    expect(storyLikesArray).not.toContain(userId1);
  });

  test("bookmarking story updates user", async () => {
    const response = await api
      .patch(`/api/story/bookmark/${storyId}`)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toMatch(/bookmarks updated/i);

    const user = await User.findById({ _id: userId1 });
    const userBookmarskArr = user.bookmarks.map((storyId) =>
      storyId.toString()
    );

    expect(userBookmarskArr).toContain(storyId);
  });

  test("bookmarking story again updates user", async () => {
    const response = await api
      .patch(`/api/story/bookmark/${storyId}`)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toMatch(/bookmarks updated/i);

    const user = await User.findById({ _id: userId1 });
    const userBookmarskArr = user.bookmarks.map((storyId) =>
      storyId.toString()
    );

    expect(userBookmarskArr).not.toContain(storyId);
  });

  test("fails to delete story with different user", async () => {
    const response = await api
      .delete(`/api/story/${storyId}`)
      .set({ authorization: `Bearer ${authToken2}` });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toMatch(
      /You are not authorized to perform this action/i
    );
  });

  test("deletes story with same user", async () => {
    const response = await api
      .delete(`/api/story/${storyId}`)
      .set({ authorization: `Bearer ${authToken1}` });

    expect(response.statusCode).toBe(204);

    const user = await User.findById({ _id: userId1 });
    const storiesArr = user.stories.map((story) => story.toString());

    expect(storiesArr).not.toContain(storyId);
  });

  test("fails to retrieve deleted story", async () => {
    const response = await api.get(`/api/story/${storyId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/story not found/i);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
