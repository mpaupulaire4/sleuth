import { Board } from "./Game/Board";
import type { Cell } from "./Game/Cell";

export class TestBoard extends Board {
  get cells() {
    return this._cells;
  }

  set cells(list: Cell<number>[][]) {
    this._cells = list;
  }

  print() {
    console.log(
      this._cells
        .map(
          (r) =>
            `${r
              .map((c) => `[${[...c].join(" ").padEnd(11, " ")}]`)
              .join(" ")}`,
        )
        .join("\n"),
    );
  }
}
