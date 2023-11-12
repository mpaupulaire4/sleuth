import type { Board } from "../Board";
import { Clue, ClueType } from "./Base";

export class BeforeClue extends Clue {
  type: ClueType = ClueType.Before;

  constructor(public tiles: [[number, number], [number, number]]) {
    super(tiles);
  }

  apply(board: Board): void {
    const [[row1, id1], [row2, id2]] = this.tiles;
    let found_fist = false;
    let found_second = false;
    let c = 0;
    for (; c < board.length; c++) {
      const cell1 = board.get(row1, c);
      if (!found_fist) {
        board.remove(row2, c, id2);
      }
      if (cell1?.has(id1)) {
        found_fist = true;
        break;
      }
    }
    for (let c2 = board.length - 1; c2 > c; c2--) {
      const cell2 = board.get(row2, c2);
      if (!found_second) {
        board.remove(row1, c2, id1);
      }
      if (cell2?.has(id2)) {
        break;
      }
    }
  }

  validate(board: Board): boolean {
    const [[row1, id1], [row2, id2]] = this.tiles;
    let found_first = false
    for (let i = 0; i < board.length; i++) {
      found_first ||= !!board.get(row1, i)?.is(id1)
      if (board.get(row2, i)?.is(id2)) {
        return found_first;
      }
    }
    return false;
  }
}
