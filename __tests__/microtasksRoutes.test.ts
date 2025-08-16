import request from "supertest";
import { app } from "../src/server";

describe("microtasks routing", () => {
  it("GET /api/tasks/:taskid/microtasks is routed", async () => {
    const res = await request(app).get("api/tasks/1/microtasks");
    expect(res.status).toBe(401);
  });

  it("POST /api/tasks/:taskid/microtasks is routed", async () => {
    const res = await request(app)
      .post("api/tasks/1/microtasks")
      .send({ descrptoin: "test" });
    expect(res.status).toBe(401);
  });

  it("PATCH /api/microtasks/:microTaskId is routed", async () => {
    const res = await request(app)
      .patch("api/microtasks/1")
      .send({ descrptoin: "test" });
    expect(res.status).toBe(401);
  });

  it("DELETE /api/microtasks/:microTaskId i routed", async () => {
    const res = await request(app).delete("api/microtasks/1");
    expect(res.status).toBe(401);
  });
});
