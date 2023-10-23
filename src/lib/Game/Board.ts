import type { Subscriber, Unsubscriber, Readable } from "svelte/store";
import { shuffle } from "../utils";

const BOARD_SIZE = 6;

export type iBoard = Array<Array<Set<number>>>;
export type iSolvedBoard = Array<Array<number>>;

// class Cell<T> extends Set<T> implements Readable<Cell<T>> {
//   private subscribers: Subscriber<Cell<T>>[] = [];
//
//   set = (v: T): boolean => {
//     let changed = false;
//     for (let i of this) {
//       if (i !== v) {
//         changed = true;
//         this.delete(i);
//       }
//     }
//     if (!this.has(v)) {
//       changed = true;
//       this.add(v);
//     }
//     return changed;
//   };
//
//   subscribe = (run: Subscriber<Cell<T>>): Unsubscriber => {
//     this.subscribers.push(run);
//     run(this);
//     return () => {
//       const i = this.subscribers.findIndex((s) => s === run);
//       if (i > -1) this.subscribers.splice(i, 1);
//     };
//   };
// }

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

export function generate_board(board_size = BOARD_SIZE): iBoard {
  const board: iBoard = [];
  const tiles = Array(board_size)
    .fill(0)
    .map((_, i) => i);

  for (let i = 0; i < board_size; i++) {
    board[i] = [];
    for (let j = 0; j < board_size; j++) {
      board[i].push(new Set(tiles));
    }
  }
  return board;
}

export function add_to_board(
  board: iBoard,
  row: number,
  col: number,
  id: number,
): boolean {
  const cell = board[row][col];
  if (!cell.has(id)) {
    cell.add(id);
    return true;
  }
  return false;
}

export function remove_from_board(
  board: iBoard,
  row: number,
  col: number,
  id: number,
  set = false,
): boolean {
  let changed = false;
  const cell = board[row][col];
  if (set) {
    for (let o of cell) {
      if (o !== id) {
        changed = true;
        cell.delete(o);
      }
    }
  } else {
    changed = cell.delete(id);
  }
  if (changed && cell.size === 1) {
    const v = cell.values().next().value as number;
    for (let i = 0; i < board[row].length; i++) {
      if (i === col) continue;
      remove_from_board(board, row, i, v);
    }
  }
  return changed;
}
