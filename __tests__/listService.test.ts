import { jest } from "@jest/globals";
import { pool } from "../src/db";
import { editList } from "../src/services/Lists/listService";
describe("editList", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("updates provided fiels and uses correct parameters", async () => {
    const mock = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await editList(10, 5, "New Name", "New Goal", 3);

    expect(mock.mock.calls[0][0]).toContain(
      "UPDATE Lists SET name = $3, overall_goal = $4, parent_list = $5"
    );
    expect(mock.mock.calls[0][1]).toEqual([5, 10, "New Name", "New Game", 3]);
  });
});
