import { type iSolvedBoard } from "./Board";
import { swap } from "../utils";
import { Clue, ClueType } from "./Clue/Base";
import { ExactClue } from "./Clue/Exact";
import { SameClue } from "./Clue/Same";
import { AdjacentClue } from "./Clue/Adjacent";
import { SequentialClue } from "./Clue/Sequential";
import { BeforeClue } from "./Clue/Before";

// Generate a list of all possible clues for the given solved board.
export function generate_all_clues(board: iSolvedBoard): Clue[] {
  const clues: Clue[] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const id = board[r][c];
      // Exact clues.
      clues.push(new ExactClue([[r, id]], c));
      // Same clues.
      for (let r2 = r + 1; r2 < board.length; r2++) {
        clues.push(
          new SameClue([
            [r, id],
            [r2, board[r2][c]],
          ]),
        );
      }
      if (c + 1 < board[r].length) {
        // Adjacent clues.
        for (let r2 = 0; r2 < board.length; r2++) {
          clues.push(
            new AdjacentClue(
              swap([
                [r, id],
                [r2, board[r2][c + 1]],
              ]),
            ),
          );
          if (c > 0) {
            // Sequential clues.
            for (let r3 = 0; r3 < board.length; r3++) {
              clues.push(
                new SequentialClue(
                  swap([
                    [r2, board[r2][c - 1]],
                    [r, id],
                    [r3, board[r3][c + 1]],
                  ]),
                ),
              );
            }
          }
        }
      }
      // Before clues.
      for (let r2 = 0; r2 < board.length; r2++) {
        for (let c2 = c + 1; c2 < board[r2].length; c2++) {
          clues.push(
            new BeforeClue([
              [r, id],
              [r2, board[r2][c2]],
            ]),
          );
        }
      }
    }
  }
  return clues;
}

export function cluesToString(clues: Clue[]): string {
  return clues.map((c) => c.toStorageString()).join("$");
}

export function cluesFromString(data: string | null): Clue[] {
  if (!data) return [];
  return data
    .split("$")
    .filter((d) => d)
    .map((data) => {
      const [typeS] = data.split("|");
      const type = parseInt(typeS);
      switch (type) {
        case ClueType.Adjacent: {
          const clue = new AdjacentClue([
            [0, 0],
            [0, 0],
          ]);
          clue.fromStorageString(data);
          return clue;
        }
        case ClueType.Same: {
          const clue = new SameClue([
            [0, 0],
            [0, 0],
          ]);
          clue.fromStorageString(data);
          return clue;
        }
        case ClueType.Before: {
          const clue = new BeforeClue([
            [0, 0],
            [0, 0],
          ]);
          clue.fromStorageString(data);
          return clue;
        }
        case ClueType.Sequential: {
          const clue = new SequentialClue([
            [0, 0],
            [0, 0],
            [0, 0],
          ]);
          clue.fromStorageString(data);
          return clue;
        }
        case ClueType.Exact: {
          const clue = new ExactClue([[0, 0]], 0);
          clue.fromStorageString(data);
          return clue;
        }
        default: {
          throw Error("unrecognized clue type");
        }
      }
    });
}

export { Clue, ClueType, SAVE_CLUE_KEY } from "./Clue/Base";
