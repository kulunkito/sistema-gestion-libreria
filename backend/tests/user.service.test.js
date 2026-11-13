import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  role: { id: 1, name: "ADMIN" },
  user: null,
  models: {
    Role: { findByPk: vi.fn() },
    User: { count: vi.fn(), create: vi.fn(), findByPk: vi.fn() }
  }
}));

vi.mock("../src/models/index.js", () => state.models);

import { createUser, updateUser } from "../src/services/user.service.js";

function createUserInstance(values) {
  return {
    ...values,
    values: { ...values },
    update: vi.fn(async function update(updates) {
      Object.assign(this.values, updates);
      Object.assign(this, updates);
    }),
    async reload() {
      return this;
    },
    get() {
      return { ...this.values };
    }
  };
}

describe("user service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BCRYPT_ROUNDS = "4";
    state.role = { id: 1, name: "ADMIN" };
    state.user = createUserInstance({
      id: 5,
      roleId: 1,
      name: "Admin",
      email: "admin@example.com",
      passwordHash: "old-hash",
      isActive: true,
      role: { id: 1, name: "ADMIN" }
    });
    state.models.Role.findByPk.mockResolvedValue(state.role);
    state.models.User.count.mockResolvedValue(1);
    state.models.User.findByPk.mockResolvedValue(state.user);
    state.models.User.create.mockImplementation(async values => createUserInstance({
      id: 6,
      ...values,
      isActive: true
    }));
  });

  it("never returns password hashes when creating a user", async () => {
    const result = await createUser({
      name: "Vendedor",
      email: "vendedor@example.com",
      password: "secure-password",
      roleId: 1
    });

    expect(result).not.toHaveProperty("passwordHash");
    expect(result).toMatchObject({ email: "vendedor@example.com", roleId: 1 });
    expect(state.models.User.create.mock.calls[0][0].passwordHash).not.toBe("secure-password");
  });

  it("never returns password hashes when updating a password", async () => {
    const result = await updateUser(5, { password: "new-secure-password" });

    expect(result).not.toHaveProperty("passwordHash");
    expect(state.user.values.passwordHash).not.toBe("new-secure-password");
  });

  it("prevents demoting the last active administrator", async () => {
    state.models.User.count.mockResolvedValue(0);
    state.models.Role.findByPk.mockImplementation(async roleId => (
      roleId === 2 ? { id: 2, name: "SELLER" } : state.role
    ));

    await expect(updateUser(5, { roleId: 2 })).rejects.toMatchObject({ status: 409 });

    expect(state.user.update).not.toHaveBeenCalled();
  });
});
