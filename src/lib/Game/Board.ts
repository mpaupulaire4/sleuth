import type { Subscriber, Unsubscriber, Readable } from "svelte/store";
import { shuffle } from "../utils";

const BOARD_SIZE = 6;

export type iBoard = Array<Array<Set<number>>>;
export type iSolvedBoard = Array<Array<number>>;

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
