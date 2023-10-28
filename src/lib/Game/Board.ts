import { Cell } from "./Cell";
import { shuffle } from "../utils";

const BOARD_SIZE = 6;

export type iBoard = Array<Array<Cell<number>>>;
export type iSolvedBoard = Array<Array<number>>;

export class Board implements Iterable<Iterable<Cell<number>>> {
  protected _cells: iBoard;

  constructor(size = BOARD_SIZE) {
    this._cells = generate_board(size);
  }

  get length() {
    return this._cells.length;
  }

  get(row: number, col: number): Cell<number> | undefined {
    return this._cells[row][col];
  }

  add(row: number, col: number, id: number): boolean {
    const cell = this.get(row, col);
    if (cell && !cell.has(id)) {
      cell.add(id);
      return true;
    }
    return false;
  }

  // TODO: Simplify
  remove(row: number, col: number, id: number, set = false): boolean {
    let changed = false;
    const cell = this.get(row, col);
    if (!cell) return false;
    if (set) {
      for (let o of cell) {
        if (o !== id) {
          changed = true;
          this.remove(row, col, o);
        }
      }
    } else {
      changed = cell.delete(id);
      if (changed) {
        let newCol = 0;
        const others = this._cells[row].filter((s, i) => {
          let b = s.has(id);
          if (b) newCol = i;
          return s.has(id);
        });
        if (others.length === 1) {
          this.remove(row, newCol, id, true);
        }
      }
    }
    if (changed && cell.size === 1) {
      const v = cell.values().next().value as number;
      for (let i = 0; i < this._cells[row].length; i++) {
        if (i === col) continue;
        this.remove(row, i, v);
      }
    }
    return changed;
  }

  [Symbol.iterator](): Iterator<Iterable<Cell<number>>, any, undefined> {
    return this._cells.values();
  }
}

// Generate a random, solved board.
export function generate_solved_board(board_size = BOARD_SIZE): iSolvedBoard {
  const board: iSolvedBoard = [];
  const tiles = Array(board_size)
    .fill(0)
    .map((_, i) => i);

  for (let i = 0; i < board_size; i++) {
    board.push(shuffle(tiles.slice()));
  }
  return board;
}

function generate_board(board_size = BOARD_SIZE): iBoard {
  const board: iBoard = [];
  const tiles = Array(board_size)
    .fill(0)
    .map((_, i) => i);

  for (let i = 0; i < board_size; i++) {
    board[i] = [];
    for (let j = 0; j < board_size; j++) {
      board[i].push(new Cell(tiles));
    }
  }
  return board;
}
