import type {
  Invalidator,
  Readable,
  Subscriber,
  Unsubscriber,
} from "svelte/store";
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

export abstract class Clue implements Saveable, Loadable, Readable<boolean> {
  private subscribers: Subscriber<boolean>[] = [];
  private valid = false;
  abstract type: ClueType;

  constructor(public tiles: [number, number][]) {
    this.tiles = tiles;
  }

  abstract apply(board: Board): void;
  protected abstract _validate(board: Board): boolean;

  validate(board: Board): boolean {
    const v = this._validate(board);
    if (v !== this.valid) {
      this.valid = v;
      this.subscribers.forEach((r) => r(v));
    }
    return this.valid;
  }

  subscribe = (run: Subscriber<boolean>): Unsubscriber => {
    run(this.valid);
    this.subscribers.push(run);
    return () => {
      const i = this.subscribers.findIndex((s) => s === run);
      if (i > -1) this.subscribers.splice(i, 1);
    };
  };

  get key() {
    return SAVE_CLUE_KEY;
  }

  toStorageString(): string {
    return `${this.type}|${this.tiles.map((t) => t.join(":")).join("|")}`;
  }

  fromStorageString(data: string | null): void {
    if (!data) throw Error("empty data when restoring clue");
    const [_, ...tilesS] = data.split("|").filter((d) => d);
    this.tilesFromStorageStrings(tilesS);
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
