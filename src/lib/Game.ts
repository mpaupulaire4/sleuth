import { shuffle } from "./utils";
import { Board, generate_solved_board } from "./Game/Board";
import { generate_all_clues, type Clue } from "./Game/Clue";

const BOARD_SIZE = 6;

// TODO: use a set of IDs to chech that cles have been completed
// and for when the board is solved: Set<`${row}:${id}`>
export function generate_clues(): Clue[] {
  const solved_board = generate_solved_board(BOARD_SIZE);
  const all_clues = generate_all_clues(solved_board);
  return solve(shuffle(all_clues));
}

export function solve(all_clues: Clue[], size = 6): Clue[] {
  const board = new Board(size);
  const clues: Clue[] = [];
  while (!board.isFinished) {
    const clue = all_clues.pop();
    if (!clue) continue;

    clue.apply(board);
    if (!board.changed) continue;

    clues.push(clue);
    while (board.changed) {
      board.clearChanges();
      for (let clue of clues) {
        clue.apply(board);
      }
    }
    board.clearChanges();
  }
  return shuffle(clues);
}
