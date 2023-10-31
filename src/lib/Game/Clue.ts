import { Board, type iSolvedBoard } from "./Board";
import { shuffle, swap } from "../utils";


// TODO: remove change tracking logic
// TODO: make Clue a class
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

function applyExact(clue: ExactClue, board: Board): boolean {
  const [[row, id]] = clue.tiles;
  const col = clue.col;
  return board.remove(row, col, id, true);
}

interface AdjacentClue extends BaseClue {
  type: ClueType.Adjacent;
  tiles: [[number, number], [number, number]];
}

function applyAdjacent(clue: AdjacentClue, board: Board): boolean {
  let changed = false;
  for (let c = 0; c < board.length; c++) {
    for (let [one, two] of [
      [0, 1],
      [1, 0],
    ]) {
      const [row1, id1] = clue.tiles[one];
      const [row2, id2] = clue.tiles[two];
      const cell = board.get(row1, c);
      const cellL = board.get(row2, c - 1);
      const cellR = board.get(row2, c + 1);
      if (cell?.is(id1)) {
        changed = board.remove(row2, c, id2) || changed;
        if (!cellL?.has(id2)) {
          return board.remove(row2, c + 1, id2, true) || changed;
        }
        if (!cellR?.has(id2)) {
          return board.remove(row2, c - 1, id2, true) || changed;
        }
      } else if (!cellL?.has(id2) && !cellR?.has(id2)) {
        changed = board.remove(row1, c, id1) || changed;
      }
    }
  }
  return changed;
}

interface SameClue extends BaseClue {
  type: ClueType.Same;
  tiles: [[number, number], [number, number]];
}

function applySame(clue: SameClue, board: Board): boolean {
  let changed = false;
  const [[row1, id1], [row2, id2]] = clue.tiles;
  for (let c = 0; c < board.length; c++) {
    const cell1 = board.get(row1, c);
    const cell2 = board.get(row2, c);
    if (cell1?.is(id1)) {
      return board.remove(row2, c, id2, true) || changed;
    }
    if (cell2?.is(id2)) {
      return board.remove(row1, c, id1, true) || changed;
    }
    if (!cell1?.has(id1)) {
      changed = board.remove(row2, c, id2) || changed;
    }
    if (!cell2?.has(id2)) {
      changed = board.remove(row1, c, id1) || changed;
    }
  }
  return changed;
}

interface BeforeClue extends BaseClue {
  type: ClueType.Before;
  tiles: [[number, number], [number, number]];
}

function applyBefore(clue: BeforeClue, board: Board): boolean {
  const [[row1, id1], [row2, id2]] = clue.tiles;
  let changed = false;
  let found_fist = false;
  let found_second = false;
  let c = 0;
  for (; c < board.length; c++) {
    const cell1 = board.get(row1, c);
    if (!found_fist) {
      changed = board.remove(row2, c, id2) || changed;
    }
    if (cell1?.has(id1)) {
      found_fist = true;
      break;
    }
  }
  for (let c2 = board.length - 1; c2 > c; c2--) {
    const cell2 = board.get(row2, c2);
    if (!found_second) {
      changed = board.remove(row1, c2, id1) || changed;
    }
    if (cell2?.has(id2)) {
      break;
    }
  }
  return changed;
}

interface SequentialClue extends BaseClue {
  type: ClueType.Sequential;
  tiles: [[number, number], [number, number], [number, number]];
}

function applySequential(clue: SequentialClue, board: Board): boolean {
  let changed = false;
  for (let c = 0; c < board.length; c++) {
    const [row1, id1] = clue.tiles[0];
    const [rowMid, idMid] = clue.tiles[1];
    const [row2, id2] = clue.tiles[2];
    const cellMid = board.get(rowMid, c);
    if (cellMid?.is(idMid)) {
      changed = board.remove(row1, c, id1) || changed;
      changed = board.remove(row2, c, id2) || changed;
    } else if (
      (!board.get(row1, c - 1)?.has(id1) &&
        !board.get(row2, c - 1)?.has(id2)) ||
      (!board.get(row1, c + 1)?.has(id1) && !board.get(row2, c + 1)?.has(id2))
    ) {
      changed = board.remove(rowMid, c, idMid) || changed;
    }
    for (let [me, other] of [
      [0, 2],
      [2, 0],
    ]) {
      const [row1, id1] = clue.tiles[me];
      const [row2, id2] = clue.tiles[other];
      const cell1 = board.get(row1, c - 1);
      const cell2 = board.get(row2, c + 1);
      if (cellMid?.is(idMid)) {
        if (!cell1?.has(id1) || !cell2?.has(id2)) {
          changed = board.remove(row2, c - 1, id2, true) || changed;
          return board.remove(row1, c + 1, id1, true) || changed;
        }
      } else if (cell1?.is(id1) && cell2?.is(id2)) {
        return board.remove(rowMid, c, idMid, true) || changed;
      }
      const cell = board.get(row1, c);
      const cellMidR = board.get(rowMid, c + 1);
      const cellMidL = board.get(rowMid, c - 1);
      if (cell?.is(id1)) {
        if (!cellMidL?.has(idMid)) {
          changed = board.remove(rowMid, c + 1, idMid, true) || changed;
          return board.remove(row2, c + 2, id2, true) || changed;
        }
        if (!cellMidR?.has(idMid)) {
          changed = board.remove(rowMid, c - 1, idMid, true) || changed;
          return board.remove(row2, c - 2, id2, true) || changed;
        }
      }
    }
  }
  return changed;
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
            tiles: swap([
              [r, id],
              [r2, board[r2][c + 1]],
            ]),
          });
          if (c > 0) {
            // Sequential clues.
            for (let r3 = 0; r3 < board.length; r3++) {
              clues.push({
                type: ClueType.Sequential,
                tiles: swap([
                  [r2, board[r2][c - 1]],
                  [r, id],
                  [r3, board[r3][c + 1]],
                ]),
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

export function randomise_clues(clues: Clue[]): Clue[] {
  for (let clue of clues) {
    if (clue.type === ClueType.Adjacent || clue.type === ClueType.Sequential) {
      swap(clue.tiles);
    }
  }
  return shuffle(clues);
}

export function apply_clue(clue: Clue, board: Board): boolean {
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
