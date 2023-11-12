import type { Loadable, Saveable } from "../../Storage";
import type { Board } from "../Board";

export const enum ClueType {
  Exact,
  Same,
  Adjacent,
  Before,
  Sequential,
}

export const SAVE_CLUE_KEY = "SAVE_CLUE_KEY";

export abstract class Clue implements Saveable, Loadable {
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

  fromStorageString(data: string | null): void {
    if (!data) throw Error("empty data when restoring clue");
    const [_, ...tilesS] = data.split("|").filter((d) => d);
    this.tilesFromStorageStrings(tilesS)
  }

  protected tilesFromStorageStrings(data: string[]) {
    this.tiles = data.map((data) => {
      return data
        .split(":")
        .filter((d) => d)
        .map((d) => parseInt(d)) as [number, number];
    });
  }
}
