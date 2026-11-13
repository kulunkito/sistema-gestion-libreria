import { afterEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../src/middlewares/error.middleware.js";

afterEach(() => vi.restoreAllMocks());

describe("error handler", () => {
  it("maps duplicate database constraints to a safe conflict response", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    errorHandler({
      name: "SequelizeUniqueConstraintError",
      message: "duplicate key value: private detail"
    }, {}, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Ya existe un registro con esos datos"
    });
  });
});
