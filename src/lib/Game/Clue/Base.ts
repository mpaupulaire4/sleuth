import type { Saveable } from "../../Storage";
import type { Board } from "../Board";

export const enum ClueType {
  Exact,
  Same,
  Adjacent,
  Before,
  Sequential,
}

export const SAVE_CLUE_KEY = "SAVE_CLUE_KEY";

export abstract class Clue implements Saveable {
  abstract type: ClueType;

  constructor(public tiles: [number, number][]) {
    this.tiles = tiles;
  }

  abstract apply(board: Board): void;
  abstract validate(board: Board): boolean;

  get key() {
    return SAVE_CLUE_KEY;
  }

  toStorageString(): string {
    return `${this.type}|${this.tiles.map((t) => t.join(":")).join("|")}`;
  }
}

export function cluesToString(clues: Clue[]): string {
  return clues.map((c) => c.toStorageString()).join("$");
}
