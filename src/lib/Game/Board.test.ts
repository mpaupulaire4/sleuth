import { describe, test, expect, beforeEach } from "vitest";
import { generate_solved_board, Board } from "./Board";
import { Cell } from "./Cell";

export class TestBoard extends Board {
  get cells() {
    return this._cells;
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

describe("generate_solved_board", () => {
  test("generates a solved board of the specified size", () => {
    const rand = Math.random;
    Math.random = () => 0.5;
    const board = generate_solved_board(3);
    expect(board).toMatchSnapshot();
    expect(board.length).toBe(3);
    for (let row of board) {
      expect(row.length).toBe(3);
    }
    Math.random = () => 0.1;
    expect(generate_solved_board()).toMatchSnapshot();
    Math.random = rand;
  });
});

describe("Board", () => {
  let board = new TestBoard(3);
  beforeEach(() => {
    board = new TestBoard(3);
  });

  test("generates the same board of the specified size", () => {
    expect([...new Board(3)]).toEqual([
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
    ]);
  });
  describe("add_to_board", () => {
    test("allows adding to board", () => {
      expect(board.add(0, 0, 0)).toBe(false);
      expect(board.changed).toBe(false);
      expect(board.add(0, 0, 3)).toBe(true);
      expect(board.changed).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0, 1, 2, 3]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });

  describe("remove_from_board", () => {
    test("allows removing from the board", () => {
      expect(board.remove(0, 0, 0)).toBe(true);
      expect(board.changed).toBe(true);
      expect([...board]).toEqual([
        [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });

    test("sets other cells when removing down to one value", () => {
      board.cells[0][1] = new Cell([0, 1]);
      board.cells[1][1] = new Cell([0, 1]);
      board.cells[1][0] = new Cell([0, 1]);
      expect(board.remove(0, 0, 0, true)).toBe(true);
      expect(board.changed).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1]), new Cell([2])],
        [new Cell([0, 1]), new Cell([0, 1]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
      board.clearChanges();
      expect(board.remove(1, 0, 1)).toBe(true);
      expect(board.changed).toBe(true);

      board.clearChanges();
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1]), new Cell([2])],
        [new Cell([0]), new Cell([1]), new Cell([2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
      expect(board.remove(1, 0, 1)).toBe(false);
      expect(board.changed).toBe(false);
    });

    test("does nothing if the cell doesn't have the value", () => {
      expect(board.remove(0, 0, 3)).toBe(false);
      expect(board.changed).toBe(false);
    });
  });

  describe("changes sets", () => {
    test("can get changes", () => {
      board.remove(0, 0, 0, true);
      expect(board.changed).toBe(true);
      const changes = board.changeSet;
      board.notify(true);
      expect(changes).toEqual(new Set(["0:0:1", "0:0:2", "0:1:0", "0:2:0"]));
    });
    test("can apply changes", () => {
      board.remove(0, 0, 0, true);
      expect(board.changed).toBe(true);
      const changes = board.changeSet;
      board.notify(true);
      expect(changes).toEqual(new Set(["0:0:1", "0:0:2", "0:1:0", "0:2:0"]));
      board = new TestBoard(3);
      board.applyChangeSet(changes);
      board.notify();
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
    test("can reverse changes", () => {
      board.remove(0, 0, 0, true);
      expect(board.changed).toBe(true);
      const changes = board.changeSet;
      board.notify(true);
      expect(changes).toEqual(new Set(["0:0:1", "0:0:2", "0:1:0", "0:2:0"]));
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
      board.applyChangeSet(changes);
      expect([...board]).toEqual([
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);

      board.applyChangeSet(changes);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });
});
