import { describe, test, expect, afterEach } from "vitest";
import { SequentialClue } from "./Sequential";
import { TestBoard } from "../../test-utils";
import { Cell } from "../Cell";

describe("Sequential", () => {
  let board = new TestBoard(3);

  afterEach(() => {
    board = new TestBoard(3);
  });

  test("does nothing if already applied", () => {
    board.cells = [
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
    ];
    const clue = new SequentialClue([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(false);

    board.cells = [
      [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
    ];
    clue.apply(board);
    expect(board.changed).toBe(false);

    board.cells = [
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
    ];
    expect(board.changed).toBe(false);
  });

  test("removes options where not possible", () => {
    const clue = new SequentialClue([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });

  test("sets others if already set", () => {
    board.cells[0] = [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])];
    const clue = new SequentialClue([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
    ]);

    board = new TestBoard(3);
    board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
    clue.apply(board);

    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
    ]);

    board = new TestBoard(3);
    board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
    clue.apply(board);
    expect(board.changed).toBe(true);
    expect([...board]).toEqual([
      [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
      [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
    ]);
  });
});
