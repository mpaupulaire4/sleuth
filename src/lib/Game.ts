import { shuffle } from "./utils";
import {
  type iBoard,
  generate_solved_board,
  generate_board,
} from "./Game/Board";
import { generate_clues, type Clue } from "./Game/Clue";

class Board {
  static generate(): iBoard {
    const solved_board = generate_solved_board();
    const board = generate_board();
    const all_clues = generate_clues(solved_board);
    const clues: Clue[] = []
    let solved = false

    while (!solved) {

      // Getting the last clue is faster than getting the first one.
      const clue = all_clues.pop()!
      clues.push(clue)

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
    return [];
  }
}
