import type { Board } from "../Board";

export const enum ClueType {
  Exact,
  Same,
  Adjacent,
  Before,
  Sequential,
}

export abstract class Clue {
  abstract type: ClueType;

  constructor(public tiles: [number, number][]) {
    this.tiles = tiles;
  }

  abstract apply(board: Board): void;
  abstract validate(board: Board): boolean;
}
