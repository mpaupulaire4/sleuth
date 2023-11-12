import { describe, test, expect, afterEach } from "vitest";
import { AdjacentClue } from "./Adjacent";
import { TestBoard } from "../../test-utils";
import { Cell } from "../Cell";

describe("Adjacent", () => {
  let board = new TestBoard(3);

  afterEach(() => {
    board = new TestBoard(3);
  });

  test("does nothing if already applied", () => {
    board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
    board.cells[1] = [new Cell([0, 2]), new Cell([1]), new Cell([0, 2])];
    const clue = new AdjacentClue([
      [0, 0],
      [1, 1],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(false);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([0, 2]), new Cell([1]), new Cell([0, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
    board.clearChanges()

    board.cells[0] = [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])];
    board.cells[1] = [new Cell([1]), new Cell([0, 2]), new Cell([0, 2])];
    clue.apply(board);
    expect(board.changed).toBe(false);
  });

  test("removes options where not possible", () => {
    board.cells[0] = [
      new Cell([0, 1, 2]),
      new Cell([1, 2]),
      new Cell([0, 1, 2]),
    ];
    board.cells[1] = [
      new Cell([0, 1, 2]),
      new Cell([0, 1, 2]),
      new Cell([0, 1, 2]),
    ];
    const clue = new AdjacentClue([
      [0, 0],
      [1, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0, 1, 2]), new Cell([1, 2]), new Cell([0, 1, 2])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });

  test("sets others if already set", () => {
    board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
    board.cells[1] = [
      new Cell([0, 2]),
      new Cell([1, 0, 2]),
      new Cell([0, 1, 2]),
    ];
    const clue = new AdjacentClue([
      [0, 0],
      [1, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([2]), new Cell([0]), new Cell([1])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });
});
