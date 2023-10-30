import { shuffle } from "./utils";
import { Board, generate_solved_board } from "./Game/Board";
import { generate_clues, type Clue, apply_clue } from "./Game/Clue";

const BOARD_SIZE = 6;

// TODO: use a set of IDs to chech that cles have been completed
// and for when the board is solved: Set<`${row}:${id}`>
export function generate(): Clue[] {
  const solved_board = generate_solved_board(BOARD_SIZE);
  const all_clues = generate_clues(solved_board);
  return solve(shuffle(all_clues));
}

export function solve(all_clues: Clue[], size = 6): Clue[] {
  const board = new Board(size);
  const clues: Clue[] = [];
  while (!board.solved) {
    const clue = all_clues.pop();
    if (!clue) continue;

    apply_clue(clue, board);
    if (!board.changed) continue;

    clues.push(clue);
    while (board.changed) {
      board.clearChanges();
      for (let clue of clues) {
        apply_clue(clue, board);
      }
    }
    board.clearChanges();
  }
  return shuffle(clues);
}
