import { jest } from "@jest/globals";
import { pool } from "../src/db";
import { completeTask, createTask } from "../src/services/Tasks/tasksService";

describe("completeTask", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const baseDate = "2024-01-15T00:00:00.00Z";
  const ts = (d: Date) => d.toISOString().replace("T", " ").replace("Z", "");

  it("advances due date for daily recurrence", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [{ id: 1, recurrence: "daily", due_date: new Date(baseDate) }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    const expected = new Date(baseDate);
    expected.setDate(expected.getDate() + 1);
    expect(mock.mock.calls[1][1][0]).toBe(ts(expected));
    expect(mock.mock.calls[1][1][1]).toBe(1);
  });

  it("advances due date for weekly recurrence", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [{ id: 1, recurrence: "weekly", due_date: new Date(baseDate) }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    const expected = new Date(baseDate);
    expected.setDate(expected.getDate() + 7);
    expect(mock.mock.calls[1][1][0]).toBe(ts(expected));
    expect(mock.mock.calls[1][1][1]).toBe(1);
  });
  it("advances due date for daily recurrence", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [{ id: 1, recurrence: "daily", due_date: new Date(baseDate) }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await completeTask(1);

    const expected = new Date(baseDate);
    expected.setDate(expected.getDate() + 1);
    expect(mock.mock.calls[1][1][0]).toBe(expected);
    expect(mock.mock.calls[1][1][1]).toBe(1);
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

    const expected = new Date(baseDate);
    expected.setMonth(expected.getMonth() + 1);
    expect(mock.mock.calls[1][1][0]).toBe(ts(expected));
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

describe("createTask", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("resets sequence and retries on duplicate key", async () => {
    const insertQuery =
      "INSERT INTO tasks (description, list_id, due_date, recurrence) VALUES ($1, $2, $3, $4) RETURNING *;";
    const mock = jest
      .spyOn(pool, "query")
      .mockRejectedValueOnce({ code: "23505" })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 11 }] });

    const result = await createTask("desc", 1, new Date("2025-01-01"));

    expect(mock).toHaveBeenCalledTimes(3);
    expect(mock.mock.calls[1][0]).toContain("setval('tasks_id_seq'");
    const normalized = (s: string) => s.replace(/\s+/g, " ").trim();
    expect(normalized(mock.mock.calls[2][0])).toBe(normalized(insertQuery));
    expect(result.id).toBe(11);
  });
});
