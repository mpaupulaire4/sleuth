import { remove_from_board, type iBoard, type iSolvedBoard } from "./Board";
import { shuffle, cell_is } from "../utils";

export const enum ClueType {
  Exact,
  Same,
  Adjacent,
  Before,
  Sequential,
}

interface BaseClue {
  type: ClueType;
  tiles: [number, number][];
}

interface ExactClue extends BaseClue {
  type: ClueType.Exact;
  tiles: [[number, number]];
  col: number;
}

function applyExact(clue: ExactClue, board: iBoard): boolean {
  const [[row, id]] = clue.tiles;
  const col = clue.col;
  return remove_from_board(board, row, col, id, true);
}

interface AdjacentClue extends BaseClue {
  type: ClueType.Adjacent;
  tiles: [[number, number], [number, number]];
}

function applyAdjacent(clue: AdjacentClue, board: iBoard) { }

interface SameClue extends BaseClue {
  type: ClueType.Same;
  tiles: [[number, number], [number, number]];
}

function applySame(clue: SameClue, board: iBoard) {
  let changed = false;
  const [[row1, id1], [row2, id2]] = clue.tiles;
  for (let i = 0; i < board.length; i++) {
    const cell1 = board[row1][i];
    const cell2 = board[row2][i];
    // may not be needed
    // if (cell_is(cell1, id1) && cell_is(cell2, id2)) {
    //   return false;
    // }
    if (cell_is(cell1, id1)) {
      return remove_from_board(board, row2, i, id2, true);
    }
    if (cell_is(cell2, id2)) {
      return remove_from_board(board, row1, i, id1, true);
    }
    if (!cell1.has(id1)) {
      changed = remove_from_board(board, row2, i, id2);
    }
    if (!cell2.has(id2)) {
      changed = remove_from_board(board, row1, i, id1);
    }
  }
}

interface BeforeClue extends BaseClue {
  type: ClueType.Before;
  tiles: [[number, number], [number, number]];
}

function applyBefore(clue: BeforeClue, board: iBoard) { }

interface SequentialClue extends BaseClue {
  type: ClueType.Sequential;
  tiles: [[number, number], [number, number], [number, number]];
}

function applySequential(clue: SequentialClue, board: iBoard) { }

export type Clue =
  | ExactClue
  | AdjacentClue
  | SameClue
  | BeforeClue
  | SequentialClue;

// Generate a list of all possible clues for the given solved board.
export function generate_clues(board: iSolvedBoard): Clue[] {
  const clues: Clue[] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const id = board[r][c];
      // Exact clues.
      clues.push({
        type: ClueType.Exact,
        tiles: [[r, id]],
        col: c,
      });
      // Same clues.
      for (let r2 = r + 1; r2 < board.length; r2++) {
        clues.push({
          type: ClueType.Same,
          tiles: [
            [r, id],
            [r2, board[r2][c]],
          ],
        });
      }
      if (c + 1 < board[r].length) {
        // Adjacent clues.
        for (let r2 = 0; r2 < board.length; r2++) {
          clues.push({
            type: ClueType.Adjacent,
            tiles: swap([
              [r, id],
              [r2, board[r2][c + 1]],
            ]),
          });
          if (c > 0) {
            // Sequential clues.
            clues.push({
              type: ClueType.Sequential,
              tiles: swap([
                [r2, board[r2][c - 1]],
                [r, id],
                [r2, board[r2][c + 1]],
              ]),
            });
          }
        }
      }
      // Before clues.
      for (let r2 = 0; r2 < board.length; r2++) {
        for (let c2 = c + 1; c2 < board[r2].length; c2++) {
          clues.push({
            type: ClueType.Before,
            tiles: [
              [r, id],
              [r2, board[r2][c2]],
            ],
          });
        }
      }
    }
  }
  return shuffle(clues);
}

function swap<A extends [unknown, unknown, ...unknown[]]>(a: A): A {
  if (Math.random() < 0.5) {
    const x = a[a.length - 1];
    a[a.length - 1] = a[0];
    a[0] = x;
  }
  return a;
}

export function apply(clue: Clue, board: iBoard): boolean {
  switch (clue.type) {
    case ClueType.Exact: {
      return applyExact(clue, board);
    }
    case ClueType.Sequential: {
      return applySequential(clue, board);
    }
    case ClueType.Same: {
      return applySame(clue, board);
    }
    case ClueType.Before: {
      return applyBefore(clue, board);
    }
    case ClueType.Adjacent: {
      return applyAdjacent(clue, board);
    }
  }
}
