import request from "supertest";
import { app } from "../src/server";

describe("auth", () => {
  it("rejects missing credential", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect([400, 401]).toContain(res.status);
  });
});
