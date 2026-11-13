import { beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

const state = vi.hoisted(() => ({
  user: null,
  findOne: vi.fn()
}));

vi.mock("../src/models/index.js", () => ({
  User: {
    scope: () => ({ findOne: state.findOne })
  },
  Role: {}
}));

import { login } from "../src/services/auth.service.js";
import bcrypt from "bcrypt";

describe("auth service", () => {
  beforeEach(async () => {
    process.env.JWT_SECRET = "test-secret-with-more-than-thirty-two-characters";
    state.user = {
      id: 8,
      name: "Vendedor",
      email: "vendedor@example.com",
      isActive: true,
      role: { name: "SELLER" },
      passwordHash: await bcrypt.hash("valid-password", 4)
    };
    state.findOne.mockReset();
    state.findOne.mockResolvedValue(state.user);
  });

  it("authenticates active users and returns a signed token without the hash", async () => {
    const result = await login("vendedor@example.com", "valid-password");

    expect(jwt.verify(result.token, process.env.JWT_SECRET).sub).toBe(8);
    expect(result.user).toEqual({
      id: 8,
      name: "Vendedor",
      email: "vendedor@example.com",
      role: "SELLER"
    });
    expect(result.user).not.toHaveProperty("passwordHash");
  });

  it("rejects unknown, inactive, and wrong-password accounts with the same status", async () => {
    state.findOne.mockResolvedValue(null);
    await expect(login("missing@example.com", "nope")).rejects.toMatchObject({ status: 401 });

    state.user.isActive = false;
    state.findOne.mockResolvedValue(state.user);
    await expect(login("vendedor@example.com", "valid-password")).rejects.toMatchObject({ status: 401 });

    state.user.isActive = true;
    await expect(login("vendedor@example.com", "wrong-password")).rejects.toMatchObject({ status: 401 });
  });
});
