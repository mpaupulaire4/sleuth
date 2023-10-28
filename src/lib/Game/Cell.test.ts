import { describe, test, expect, beforeEach } from "vitest";
import { add_to_board, remove_from_board, Cell } from "./Cell";
import type { iBoard } from "./Board";

let board: iBoard = [];
beforeEach(() => {
  board = [
    [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
  ];
});

describe("add_to_board", () => {
  test("allows adding to board", () => {
    expect(add_to_board(board, 0, 0, 0)).toBe(false);
    expect(add_to_board(board, 0, 0, 3)).toBe(true);
    expect(board).toEqual([
      [new Cell([0, 1, 2, 3]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });
});

describe("remove_from_board", () => {
  test("allows removing from the board", () => {
    expect(remove_from_board(board, 0, 0, 0)).toBe(true);
    expect(board).toEqual([
      [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });

  test("sets other cells when removing down to one value", () => {
    board[0][1] = new Cell([0, 1]);
    board[1][1] = new Cell([0, 1]);
    board[1][0] = new Cell([0, 1]);
    expect(remove_from_board(board, 0, 0, 0, true)).toBe(true);
    expect(board).toEqual([
      [new Cell([0]), new Cell([1]), new Cell([2])],
      [new Cell([0, 1]), new Cell([0, 1]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
    expect(remove_from_board(board, 1, 0, 1)).toBe(true);
    expect(board).toEqual([
      [new Cell([0]), new Cell([1]), new Cell([2])],
      [new Cell([0]), new Cell([1]), new Cell([2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
    expect(remove_from_board(board, 1, 0, 1)).toBe(false);
  });

  test("does nothing if the cell doesn't have the value", ()=>{
    expect(remove_from_board(board, 0, 0, 3)).toBe(false);
  })
});
