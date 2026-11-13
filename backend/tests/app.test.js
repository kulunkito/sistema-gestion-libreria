import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API app", () => {
  it("serves the versioned health endpoint", async () => {
    const response = await request(app)
      .get("/api/v1/health")
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: "Libreria API funcionando"
    });
  });

  it("returns a consistent not-found response", async () => {
    const response = await request(app)
      .get("/api/v1/unknown")
      .expect(404);

    expect(response.body).toMatchObject({ success: false });
  });
});
