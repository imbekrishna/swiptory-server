import { describe, test, afterAll, beforeAll, assert, expect } from "vitest";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import User from "../models/user.model.js";

const api = supertest(app);

const validUserData = {
  username: "imbekrishna",
  password: "Imbekrishna@234",
};

beforeAll(async () => {
  await User.deleteMany({});
});

describe("Auth route", () => {
  const invalidUserData = {
    username: "imbekrishna",
    password: "we234",
  };

  test("logs in the user with valid data", async () => {
    const user = await api.post("/api/user").send(validUserData);

    const response = await api.post("/api/auth/login").send(validUserData);

    const loginData = response.body.data;

    expect(response.statusCode).toEqual(200);
    expect(loginData.username).toEqual(validUserData.username);
    expect(loginData.token).toBeDefined();
  });

  test("fails to log in the user with invalid data", async () => {
    const response = await api.post("/api/auth/login").send(invalidUserData);

    const body = response.body;

    expect(response.statusCode).toEqual(400);
    expect(body.error).toMatch(/invalid username\/password/i);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
