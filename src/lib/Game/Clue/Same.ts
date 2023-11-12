import type { Board } from "../Board";
import { Clue, ClueType } from "./Base";

export class SameClue extends Clue {
  type: ClueType = ClueType.Same;

  constructor(public tiles: [[number, number], [number, number]]) {
    super(tiles);
  }

  apply(board: Board): void {
    const [[row1, id1], [row2, id2]] = this.tiles;
    for (let c = 0; c < board.length; c++) {
      const cell1 = board.get(row1, c);
      const cell2 = board.get(row2, c);
      if (cell1?.is(id1)) {
        board.remove(row2, c, id2, true);
        return;
      }
      if (cell2?.is(id2)) {
        board.remove(row1, c, id1, true);
        return;
      }
      if (!cell1?.has(id1)) {
        board.remove(row2, c, id2);
      }
      if (!cell2?.has(id2)) {
        board.remove(row1, c, id1);
      }
    }
  }

  _validate(board: Board): boolean {
    const [[row1, id1], [row2, id2]] = this.tiles;
    for (let i = 0; i < board.length; i++) {
      if (board.get(row1, i)?.is(id1)) {
        return !!board.get(row2, i)?.is(id2);
      }
      if (board.get(row2, i)?.is(id2)) {
        return !!board.get(row1, i)?.is(id1);
      }
    }
    return false;
  }
}
