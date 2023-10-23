import { describe, test, expect } from "vitest";
import { generate_board, generate_solved_board } from "./Board";

describe("generate_solved_board", () => {
  test("generates a board of the specified size", () => {
    const rand = Math.random;
    Math.random = () => 0.5;
    const board = generate_solved_board(3);
    expect(board).toMatchSnapshot();
    expect(board.length).toBe(3);
    for (let row of board) {
      expect(row.length).toBe(3);
    }
    Math.random = () => 0.1;
    expect(generate_solved_board()).toMatchSnapshot();
    Math.random = rand;
  });
});

describe("generate_board", () => {
  test("generates the same board of the specified size", () => {
    expect(generate_board(3)).toEqual([
      [new Set([0, 1, 2]), new Set([0, 1, 2]), new Set([0, 1, 2])],
      [new Set([0, 1, 2]), new Set([0, 1, 2]), new Set([0, 1, 2])],
      [new Set([0, 1, 2]), new Set([0, 1, 2]), new Set([0, 1, 2])],
    ]);
  });
});
