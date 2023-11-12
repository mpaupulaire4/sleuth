import { describe, test, expect, afterEach } from "vitest";
import { SameClue } from "./Same";
import { TestBoard } from "../../test-utils";
import { Cell } from "../Cell";

describe("Same", () => {
  let board = new TestBoard(3);

  afterEach(() => {
    board = new TestBoard(3);
  });

  test("does nothing if the rule is already set or cannot be set", () => {
    const clue = new SameClue([
      [0, 0],
      [1, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(false);
    board.cells[0][0] = new Cell([0]);
    board.cells[1][0] = new Cell([0]);

    clue.apply(board);
    expect(board.changed).toBe(false);
  });

  test("removes cells if twin cannot be there", () => {
    const clue = new SameClue([
      [0, 0],
      [1, 0],
    ]);
    board.cells[0][0] = new Cell([1]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([1]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);

    board = new TestBoard(3);
    board.cells[1][0] = new Cell([1]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([1]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });

  test("sets cell if twin is set", () => {
    board.cells[0][0] = new Cell([0]);
    const clue = new SameClue([
      [0, 0],
      [1, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);

    board = new TestBoard(3);
    board.cells[1][0] = new Cell([0]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([0]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });
});
