import { describe, test, afterAll, beforeAll, assert, expect } from "vitest";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import { nanoid } from "nanoid";

const api = supertest(app);

const validUserData = {
  username: `imbekrishna+${nanoid(5)}`,
  password: "Imbekrishna@234",
};

const invalidUserData = {
  username: "imbekrishna",
  password: "we234",
};

describe("User route", () => {
  test("always returns valid response", async () => {
    // TODO: Add get user controller
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

    expect(response.statusCode).toEqual(201);
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
