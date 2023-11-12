import type { Board } from "../Board";
import { Clue, ClueType } from "./Base";

export class AdjacentClue extends Clue {
  type: ClueType = ClueType.Adjacent;

  constructor(public tiles: [[number, number], [number, number]]) {
    super(tiles);
  }

  apply(board: Board): void {
    for (let c = 0; c < board.length; c++) {
      for (let [one, two] of [
        [0, 1],
        [1, 0],
      ]) {
        const [row1, id1] = this.tiles[one];
        const [row2, id2] = this.tiles[two];
        const cell = board.get(row1, c);
        const cellL = board.get(row2, c - 1);
        const cellR = board.get(row2, c + 1);
        if (cell?.is(id1)) {
          board.remove(row2, c, id2);
          if (!cellL?.has(id2)) {
            board.remove(row2, c + 1, id2, true);
            return;
          }
          if (!cellR?.has(id2)) {
            board.remove(row2, c - 1, id2, true);
            return;
          }
        } else if (!cellL?.has(id2) && !cellR?.has(id2)) {
          board.remove(row1, c, id1);
        }
      }
    }
  }

  validate(board: Board): boolean {
    const [[row1, id1], [row2, id2]] = this.tiles;
    for (let i = 1; i < board.length - 1; i++) {
      if (board.get(row1, i)?.is(id1)) {
        return (
          !!board.get(row2, i - 1)?.is(id2) || !!board.get(row2, i + 1)?.is(id2)
        );
      }
      if (board.get(row2, i)?.is(id2)) {
        return (
          !!board.get(row1, i - 1)?.is(id1) || !!board.get(row1, i + 1)?.is(id1)
        );
      }
    }
    return false;
  }
}
