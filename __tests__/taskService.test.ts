import { jest } from "@jest/globals";
import { pool } from "../src/db";
import { completeTask } from "../src/services/Tasks/tasksService";

describe("editList", () => {
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
            due_date: new Date("2024-01-15T:00:00:00Z"),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    expect(mock).toHaveBeenCalledWith(
      2,
      "UPDATE tasks SET due_date = $1, status = 'pending', WHERE id = $2 RETURNING *;",
      ["2024-02-15 00:00:00.000", 1]
    );
  });

  it("marks task ompleted when no recurrence", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    expect(mock.mock.calls[1][0]).toContain(
      "UDATE tasks SET status = 'completed'"
    );
    expect(mock.mock.calls[1][1]).toEqual([1]);
  });
});
