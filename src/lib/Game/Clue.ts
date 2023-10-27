import { type iBoard, type iSolvedBoard } from "./Board";
import { remove_from_board } from "./Cell";
import { shuffle, swap } from "../utils";

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

function applyAdjacent(clue: AdjacentClue, board: iBoard): boolean {
  let changed = false;
  for (let c = 0; c < board.length; c++) {
    for (let [one, two] of [
      [0, 1],
      [1, 0],
    ]) {
      const [row1, id1] = clue.tiles[one];
      const [row2, id2] = clue.tiles[two];
      const cell = board[row1][c];
      const cellL = board[row2][c - 1] as Set<number> | undefined;
      const cellR = board[row2][c + 1] as Set<number> | undefined;
      if (cell.is(id1)) {
        changed = remove_from_board(board, row2, c, id2) || changed;
        if (!cellL?.has(id2)) {
          return remove_from_board(board, row2, c + 1, id2, true) || changed;
        }
        if (!cellR?.has(id2)) {
          return remove_from_board(board, row2, c - 1, id2, true) || changed;
        }
      } else if (!cellL?.has(id2) && !cellR?.has(id2)) {
        changed = remove_from_board(board, row1, c, id1);
      }
    }
  }
  return changed;
}

interface SameClue extends BaseClue {
  type: ClueType.Same;
  tiles: [[number, number], [number, number]];
}

function applySame(clue: SameClue, board: iBoard): boolean {
  let changed = false;
  const [[row1, id1], [row2, id2]] = clue.tiles;
  for (let c = 0; c < board.length; c++) {
    const cell1 = board[row1][c];
    const cell2 = board[row2][c];

    if (cell1.is(id1)) {
      return remove_from_board(board, row2, c, id2, true);
    }
    if (cell2.is(id2)) {
      return remove_from_board(board, row1, c, id1, true);
    }
    if (!cell1.has(id1)) {
      changed = remove_from_board(board, row2, c, id2) || changed;
    }
    if (!cell2.has(id2)) {
      changed = remove_from_board(board, row1, c, id1) || changed;
    }
  }
  return changed;
}

interface BeforeClue extends BaseClue {
  type: ClueType.Before;
  tiles: [[number, number], [number, number]];
}

function applyBefore(clue: BeforeClue, board: iBoard): boolean {
  const [[row1, id1], [row2, id2]] = clue.tiles;
  let changed = false;
  let found_fist = false;
  let found_second = false;
  let c = 0;
  for (; c < board.length; c++) {
    const cell1 = board[row1][c];
    if (!found_fist) {
      changed = remove_from_board(board, row2, c, id2) || changed;
    }
    if (cell1.has(id1)) {
      found_fist = true;
      break;
    }
  }
  for (let c2 = board.length - 1; c2 > c; c2--) {
    const cell2 = board[row2][c2];
    if (!found_second) {
      changed = remove_from_board(board, row1, c2, id1) || changed;
    }
    if (cell2.has(id2)) {
      break;
    }
  }
  return changed;
}

interface SequentialClue extends BaseClue {
  type: ClueType.Sequential;
  tiles: [[number, number], [number, number], [number, number]];
}

function applySequential(clue: SequentialClue, board: iBoard): boolean {
  throw "not implemented";
}

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
            tiles: [
              [r, id],
              [r2, board[r2][c + 1]],
            ],
          });
          if (c > 0) {
            // Sequential clues.
            for (let r3 = 0; r3 < board.length; r3++) {
              clues.push({
                type: ClueType.Sequential,
                tiles: [
                  [r2, board[r2][c - 1]],
                  [r, id],
                  [r3, board[r3][c + 1]],
                ],
              });
            }
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
  return clues;
}

export function randomise_clues(clues: Clue[]) {
  for (let clue of clues) {
    if (clue.type === ClueType.Adjacent || clue.type === ClueType.Sequential) {
      swap(clue.tiles);
    }
  }
  shuffle(clues);
}

export function apply_clue(clue: Clue, board: iBoard): boolean {
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
