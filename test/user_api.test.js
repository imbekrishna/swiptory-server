import { describe, test, afterAll, beforeAll, assert, expect } from "vitest";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import User from "../models/user.model.js";

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User route", () => {
  const validUserData = {
    username: "imbekrishna",
    password: "Imbekrishna@234",
  };

  const invalidUserData = {
    username: "imbekrishna",
    password: "we234",
  };

  test("returns valid response", async () => {
    await api
      .get("/api/user")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("returns message 'User found'", async () => {
    const response = await api.get("/api/user");
    const message = response.body.message;
    assert.strictEqual(message === "User found", true);
  });

  test("creates new user with valid data", async () => {
    const response = await api.post("/api/user").send(validUserData);

    const user = response.body.data;

    console.log(response.status, response.statusCode);

    expect(response.statusCode).toEqual(200);
    expect(user.username).toEqual(validUserData.username);
  });

  test("fails to create user with existing username", async () => {
    const response = await api.post("/api/user").send(validUserData);

    const body = response.body;

    expect(response.statusCode).toEqual(409);
    expect(body.error).toMatch(/username already taken/i);
  });

  test("fails to create user with invalid data", async () => {
    const response = await api.post("/api/user").send(invalidUserData);

    const body = response.body;

    expect(response.statusCode).toEqual(400);
    expect(typeof body.error).toMatch(/object/i);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
