import { Cell } from "./Cell";
import { shuffle } from "../utils";

const BOARD_SIZE = 6;

export type iSolvedBoard = Array<Array<number>>;

export type Change = `${number}:${number}:${number}`;

export class Board
  implements
    Iterable<Iterable<Cell<number>>>,
    ArrayLike<ArrayLike<Cell<number>>>
{
  readonly [n: number]: readonly Cell<number>[];
  protected _cells: Array<Array<Cell<number>>>;
  protected finished_tiles: Set<`${number}:${number}`> = new Set();
  protected changed_cells: Set<Cell<number>> = new Set();
  protected changes: Set<Change> = new Set();

  constructor(size = BOARD_SIZE) {
    this._cells = [];
    const tiles = Array(size)
      .fill(0)
      .map((_, i) => i);

    for (let i = 0; i < size; i++) {
      this._cells[i] = [];
      for (let j = 0; j < size; j++) {
        this._cells[i].push(new Cell(tiles));
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      // @ts-ignore
      this[i] = this._cells[i];
    }
  }

  get isFinished() {
    return this.finished_tiles.size === this._cells.length * this._cells.length;
  }

  get length() {
    return this._cells.length;
  }

  get changed() {
    return this.changed_cells.size > 0;
  }

  get changeSet() {
    return new Set(this.changes);
  }

  protected toggleChange(change: Change) {
    if (!this.changes.delete(change)) {
      this.changes.add(change);
    }
  }

  applyChangeSet(set: Set<Change>) {
    this.clearChanges();
    for (let change of set) {
      const [row, col, id] = change.split(":").map((v) => parseInt(v));
      const cell = this.get(row, col);
      if (!cell) continue;
      cell.toggle(id);
      this.changed_cells.add(cell);
    }
    this.notify(true);
  }

  clearChanges() {
    this.changes.clear();
    this.changed_cells.clear();
  }

  notify(clear = true) {
    for (let cell of this.changed_cells) {
      cell.notify();
    }
    if (clear) {
      this.clearChanges();
    }
  }

  get(row: number, col: number): Cell<number> | undefined {
    return this._cells[row][col];
  }

  toggle(row: number, col: number, id: number): boolean {
    const cell = this.get(row, col);
    if (!cell) return false;
    return cell.has(id) ? this.remove(row, col, id) : this.add(row, col, id);
  }

  add(row: number, col: number, id: number): boolean {
    const cell = this.get(row, col);
    if (cell && !cell.has(id)) {
      cell.add(id);
      if (cell.size !== 1) {
        this.finished_tiles.delete(`${row}:${id}`);
      }
      this.toggleChange(`${row}:${col}:${id}`);
      this.changed_cells.add(cell);
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
        this.toggleChange(`${row}:${col}:${id}`);
        this.changed_cells.add(cell);
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
      this.finished_tiles.add(`${row}:${v}`);
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
