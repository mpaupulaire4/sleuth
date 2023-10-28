import { describe, test, expect } from "vitest";
import { solve } from "./Game";
import { Board, generate_solved_board } from "./Game/Board";
import { apply_clue, generate_clues } from "./Game/Clue";

const BOARD_SIZE = 6;

describe("solve", () => {
  const solved = generate_solved_board(BOARD_SIZE);
  const all_clues = generate_clues(solved);

  test("should produce clues that allow solving a new board", () => {
    let iter = 2;
    while (iter--) {
      const clues = solve(all_clues, BOARD_SIZE);
      const board = new Board(BOARD_SIZE);
      while (!board.solved) {
        let change = false;
        for (let clue of clues) {
          change = apply_clue(clue, board) || change;
        }
        if (!change) {
          break;
        }
      }
      expect(board.is(solved)).toBe(true);
    }
  });
});
