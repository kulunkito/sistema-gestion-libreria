import { describe, expect, it, vi } from "vitest";
import { authorize } from "../src/middlewares/role.middleware.js";

describe("authorize middleware", () => {
  it("allows an assigned role", () => {
    const next = vi.fn();
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    authorize("ADMIN")({ user: { role: "ADMIN" } }, response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("rejects missing or disallowed roles", () => {
    const next = vi.fn();
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    authorize("ADMIN")({ user: { role: "SELLER" } }, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
