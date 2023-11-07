import { describe, test, expect } from "vitest";
import { solve } from "./Game";
import { Board, generate_solved_board, type iSolvedBoard } from "./Game/Board";
import { apply_clue, generate_clues, type Clue } from "./Game/Clue";
import { shuffle } from "./utils";

const BOARD_SIZE = 6;

function equal(board: Board, solved: iSolvedBoard) {
  for (let r = 0; r < solved.length; r++) {
    for (let c = 0; c < solved[r].length; c++) {
      if (!board.get(r, c)?.is(solved[r][c])) {
        return false;
      }
    }
  }
  return true;
}

function print(clues: Clue[]) {
  console.log(
    clues
      .map(
        (c) =>
          `${c.type}:[${c.tiles.map((t) => `${t[0]},${t[1]}`).join("][")}]`,
      )
      .join("\n"),
  );
}

describe("solve", () => {
  const solved = generate_solved_board(BOARD_SIZE);
  const all_clues = shuffle(generate_clues(solved));

  test("should produce clues that allow solving a new board", () => {
    const clues = solve([...all_clues], BOARD_SIZE);
    // print(clues);
    let iter = 2;
    while (iter--) {
      const board = new Board(BOARD_SIZE);
      let safe = 100;
      while (
        clues.reduce((r, c) => apply_clue(c, board) || r, false) ||
        safe--
      ) {}
      expect(equal(board, solved)).toBe(true);
    }
  });
});
