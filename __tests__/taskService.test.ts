import { jest } from "@jest/globals";
import { pool } from "../src/db";
import { completeTask } from "../src/services/Tasks/tasksService";

describe("completeTask", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("advances due date for monthly recurrence", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            recurrence: "monthly",
            due_date: new Date("2024-01-15T00:00:00Z"),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    expect(mock.mock.calls[1][0]).toBe(
      "UPDATE tasks SET due_date = $1, status = 'pending', WHERE id = $2 RETURNING *;"
    );
    expect(mock.mock.calls[1][1][1]).toBe(1);
  });

  it("marks task completed when no recurrence", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 1, recurrence: null }] })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    expect(mock.mock.calls[1][0]).toContain(
      "UPDATE tasks SET status = 'completed'"
    );
    expect(mock.mock.calls[1][1]).toEqual([1]);
  });
});
