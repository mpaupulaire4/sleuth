import type { Board } from "../Board";
import { Clue, ClueType } from "./Base";

export class ExactClue extends Clue {
  type: ClueType = ClueType.Exact;

  constructor(
    public tiles: [[number, number]],
    public col: number,
  ) {
    super(tiles);
  }

  apply(board: Board): void {
    const [[row, id]] = this.tiles;
    const col = this.col;
    board.remove(row, col, id, true);
  }

  validate(board: Board): boolean {
    const [[row, id]] = this.tiles;
    return !!board.get(row, this.col)?.is(id);
  }

  toStorageString(): string {
    return `${this.type}|${this.col}|${this.tiles
      .map((t) => t.join(":"))
      .join("|")}`;
  }

  fromStorageString(data: string | null): void {
    if (!data) throw Error("empty data when restoring clue");
    const [_, col, ...tilesS] = data.split("|").filter((d) => d);
    this.col = parseInt(col);
    this.tilesFromStorageStrings(tilesS);
  }
}
