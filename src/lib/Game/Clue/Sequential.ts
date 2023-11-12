import type { Board } from "../Board";
import { Clue, ClueType } from "./Base";

export class SequentialClue extends Clue {
  type: ClueType = ClueType.Sequential;

  constructor(
    public tiles: [[number, number], [number, number], [number, number]],
  ) {
    super(tiles);
  }

  apply(board: Board): void {
    for (let c = 0; c < board.length; c++) {
      const [row1, id1] = this.tiles[0];
      const [rowMid, idMid] = this.tiles[1];
      const [row2, id2] = this.tiles[2];
      const cellMid = board.get(rowMid, c);
      if (cellMid?.is(idMid)) {
        board.remove(row1, c, id1);
        board.remove(row2, c, id2);
      } else if (
        (!board.get(row1, c - 1)?.has(id1) &&
          !board.get(row2, c - 1)?.has(id2)) ||
        (!board.get(row1, c + 1)?.has(id1) && !board.get(row2, c + 1)?.has(id2))
      ) {
        board.remove(rowMid, c, idMid);
      }
      for (let [me, other] of [
        [0, 2],
        [2, 0],
      ]) {
        const [row1, id1] = this.tiles[me];
        const [row2, id2] = this.tiles[other];
        const cell1 = board.get(row1, c - 1);
        const cell2 = board.get(row2, c + 1);
        if (cellMid?.is(idMid)) {
          if (!cell1?.has(id1) || !cell2?.has(id2)) {
            board.remove(row2, c - 1, id2, true);
            board.remove(row1, c + 1, id1, true);
            return;
          }
        } else if (cell1?.is(id1) && cell2?.is(id2)) {
          board.remove(rowMid, c, idMid, true);
          return;
        }
        const cell = board.get(row1, c);
        const cellMidR = board.get(rowMid, c + 1);
        const cellMidL = board.get(rowMid, c - 1);
        if (cell?.is(id1)) {
          if (!cellMidL?.has(idMid)) {
            board.remove(rowMid, c + 1, idMid, true);
            board.remove(row2, c + 2, id2, true);
            return;
          }
          if (!cellMidR?.has(idMid)) {
            board.remove(rowMid, c - 1, idMid, true);
            board.remove(row2, c - 2, id2, true);
            return;
          }
        }
      }
    }
  }

  _validate(board: Board): boolean {
    const [[row1, id1], [rowMid, idMid], [row2, id2]] = this.tiles;
    for (let i = 0; i < board.length; i++) {
      if (board.get(rowMid, i)?.is(idMid)) {
        return !!(
          (board.get(row1, i - 1)?.is(id1) &&
            board.get(row2, i + 1)?.is(id2)) ||
          (board.get(row1, i + 1)?.is(id1) && board.get(row2, i - 1)?.is(id2))
        );
      }
    }
    return false;
  }
}
