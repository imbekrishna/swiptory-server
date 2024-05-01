import { describe, test, afterAll, beforeAll, assert, expect } from "vitest";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../api/app";
import { nanoid } from "nanoid";

const api = supertest(app);

const validUserData = {
  username: `imbekrishna+${nanoid(5)}`,
  password: "Imbekrishna@234",
};

const invalidUserData = {
  username: "imbekrishna",
  password: "we34",
};

describe("User route", () => {
  test("fails to retrieve user for given username", async () => {
    const response = await api.get(`/api/user/${validUserData.username}`);

    expect(response.statusCode).toBe(404);
    const message = `No user with username ${validUserData.username} found`;
    expect(response.body.message).toMatch(message);
  });

  test("creates new user with valid data", async () => {
    const response = await api.post("/api/user").send(validUserData);

    const user = response.body.data;

    expect(response.statusCode).toEqual(201);
    expect(user.username).toEqual(validUserData.username);
  });

  test("retrieves user for given username", async () => {
    const response = await api.get(`/api/user/${validUserData.username}`);
    const user = response.body.data;

    expect(response.statusCode).toBe(200);
    expect(user).toBeDefined();
    expect(user.username).toBe(validUserData.username);
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
    expect(body.error).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
