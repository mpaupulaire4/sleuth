import { shuffle } from "./utils";
import { Board, generate_solved_board } from "./Game/Board";
import {
  generate_clues,
  type Clue,
  randomise_clues,
  apply_clue,
} from "./Game/Clue";

// TODO: use a set of IDs to chech that cles have been completed
// and for when the board is solved: Set<`${row}:${id}`>
class Game {
  static generate(): Clue[] {
    const solved_board = generate_solved_board();
    const board = new Board();
    const all_clues = randomise_clues(generate_clues(solved_board));
    const clues: Clue[] = [];
    let solved = false;

    while (!solved) {
      // Getting the last clue is faster than getting the first one.
      const clue = all_clues.pop()!;
      if (apply_clue(clue, board)) {
        clues.push(clue);
      } else {
        continue;
      }

      // solved = Solver.solve()

      // Remove the last clue if it didn't affect the board.
      // if Global.board == board:
      //   Global.clues.erase(clue)
    }

    // var clues = Global.clues.duplicate()
    // for clue in clues:
    //   if randi_range(1, 10) > 3:
    //     Global.clues.erase(clue)
    // if not Solver.solve():
    // Global.clues.append(clue)
    //
    // // Clues are ready; reset board and shuffle clues.
    // Global.setup_board()
    // Global.clues.shuffle()
    // for clue in Global.clues:
    //   clue.disabled = false
    // TODO: Need to randomize clues before finishing
    return randomise_clues(clues);
  }
}

function solve(all_clues: Clue[], size = 6) {
  const board = new Board(size);
  let solved = false;
  const clues: Clue[] = [];
  while (!solved) {
    const i = Math.floor(Math.random() * all_clues.length);
    const clue = all_clues[i];

    if (apply_clue(clue, board)) {
      clues.push(clue);
    } else {
      continue;
    }
  }
}
