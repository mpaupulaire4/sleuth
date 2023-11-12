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
}
