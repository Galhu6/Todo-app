import request from "supertest";
import { app } from "../src/server";

describe("health", () => {
  it("GET /health returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });
});
