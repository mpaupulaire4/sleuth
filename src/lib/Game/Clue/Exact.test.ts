import { describe, test, expect, afterEach } from "vitest";
import { ExactClue } from "./Exact";
import { TestBoard } from "../../test-utils";
import { Cell } from "../Cell";

describe("Exact", () => {
  let board = new TestBoard(3);

  afterEach(() => {
    board = new TestBoard(3);
  });

  test("does nothing if already set", () => {
    board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
    const clue = new ExactClue([[0, 0]], 0);
    clue.apply(board);

    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });

  test("sets cell and removes from other cells in row", () => {
    const clue = new ExactClue([[0, 0]], 0);
    clue.apply(board);

    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
    board.clearChanges()

    clue.tiles = [[0, 1]];
    clue.col = 1;
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1]), new Cell([2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);

    clue.apply(board);
  });
});
