import { describe, test, expect, afterEach } from "vitest";
import { ClueType, apply_clue, generate_clues } from "./Clue";
import { Cell } from "./Cell";
import { Board, type iSolvedBoard } from "./Board";

class TestBoard extends Board {
  get cells() {
    return this._cells;
  }
  set cells(c: typeof this._cells) {
    this._cells = c;
  }
}

describe("generate_clues", () => {
  test("generates all clues", () => {
    const board: iSolvedBoard = [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ];
    const clues = generate_clues(board);

    const exact = clues.filter(({ type }) => type === ClueType.Exact);
    expect(exact.length).toBe(9);
    expect(exact).toMatchSnapshot("exact clues");

    const same = clues.filter(({ type }) => type === ClueType.Same);
    expect(same.length).toBe(9);
    expect(same).toMatchSnapshot("same clues");

    const adj = clues.filter(({ type }) => type === ClueType.Adjacent);
    expect(adj.length).toBe(18);
    expect(adj).toMatchSnapshot("adj clues");

    const before = clues.filter(({ type }) => type === ClueType.Before);
    expect(before.length).toBe(27);
    expect(before).toMatchSnapshot("before clues");

    const sequential = clues.filter(({ type }) => type === ClueType.Sequential);
    expect(sequential.length).toBe(27);
    expect(sequential).toMatchSnapshot("sequential clues");
  });
});

describe("apply_clue", () => {
  let board = new TestBoard(3);

  afterEach(() => {
    board = new TestBoard(3);
  });

  describe("Exact", () => {
    test("does nothing if already set", () => {
      board.cells[0][0] = new Cell([0]);
      expect(
        apply_clue(
          {
            type: ClueType.Exact,
            tiles: [[0, 0]],
            col: 0,
          },
          board,
        ),
      ).toBe(false);
    });
    test("sets cell and removes from other cells in row", () => {
      expect(
        apply_clue(
          {
            type: ClueType.Exact,
            tiles: [[0, 0]],
            col: 0,
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
      expect(
        apply_clue(
          {
            type: ClueType.Exact,
            tiles: [[0, 1]],
            col: 1,
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1]), new Cell([2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
      expect(
        apply_clue(
          {
            type: ClueType.Exact,
            tiles: [[0, 1]],
            col: 1,
          },
          board,
        ),
      ).toBe(false);
    });
  });

  describe("Same", () => {
    test("does nothing if the rule is already set or cannot be set", () => {
      expect(
        apply_clue(
          {
            type: ClueType.Same,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(false);
      board.cells[0][0] = new Cell([0]);
      board.cells[1][0] = new Cell([0]);
      expect(
        apply_clue(
          {
            type: ClueType.Same,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(false);
    });

    test("removes cell if twin cannot be there", () => {
      board.cells[0][0] = new Cell([1]);
      expect(
        apply_clue(
          {
            type: ClueType.Same,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([1]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);

      board = new TestBoard(3);
      board.cells[1][0] = new Cell([1]);
      expect(
        apply_clue(
          {
            type: ClueType.Same,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([1]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });

    test("sets cell if twin is set", () => {
      board.cells[0][0] = new Cell([0]);
      expect(
        apply_clue(
          {
            type: ClueType.Same,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);

      board = new TestBoard(3);
      board.cells[1][0] = new Cell([0]);
      expect(
        apply_clue(
          {
            type: ClueType.Same,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });

  describe("Adjacent", () => {
    test("does nothing if already applied", () => {
      board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      board.cells[1] = [new Cell([0, 2]), new Cell([1]), new Cell([0, 2])];
      expect(
        apply_clue(
          {
            type: ClueType.Adjacent,
            tiles: [
              [0, 0],
              [1, 1],
            ],
          },
          board,
        ),
      ).toBe(false);
      board.cells[0] = [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])];
      board.cells[1] = [new Cell([1]), new Cell([0, 2]), new Cell([0, 2])];
      expect(
        apply_clue(
          {
            type: ClueType.Adjacent,
            tiles: [
              [0, 0],
              [1, 1],
            ],
          },
          board,
        ),
      ).toBe(false);
    });

    test("removes options where not possible", () => {
      board.cells[0] = [
        new Cell([0, 1, 2]),
        new Cell([1, 2]),
        new Cell([0, 1, 2]),
      ];
      board.cells[1] = [
        new Cell([0, 1, 2]),
        new Cell([0, 1, 2]),
        new Cell([0, 1, 2]),
      ];
      expect(
        apply_clue(
          {
            type: ClueType.Adjacent,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0, 1, 2]), new Cell([1, 2]), new Cell([0, 1, 2])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });

    test("sets others if already set", () => {
      board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      board.cells[1] = [
        new Cell([0, 2]),
        new Cell([1, 0, 2]),
        new Cell([0, 1, 2]),
      ];
      expect(
        apply_clue(
          {
            type: ClueType.Adjacent,
            tiles: [
              [0, 0],
              [1, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([2]), new Cell([0]), new Cell([1])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });
  describe("Sequential", () => {
    test("does nothing if already applied", () => {
      board.cells = [
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
      ];
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
          board,
        ),
      ).toBe(false);
      board.cells = [
        [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      ];
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
          board,
        ),
      ).toBe(false);
      board.cells = [
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
      ];
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [2, 0],
              [1, 0],
              [0, 0],
            ],
          },
          board,
        ),
      ).toBe(false);
    });

    test("removes options where not possible", () => {
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });

    test("sets others if already set", () => {
      board.cells[0] = [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])];
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
      ]);

      board = new TestBoard(3);
      board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
      ]);

      board = new TestBoard(3);
      board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      expect(
        apply_clue(
          {
            type: ClueType.Sequential,
            tiles: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([1, 2]), new Cell([0])],
      ]);
    });
  });

  describe("Before", () => {
    test("does nothing if already applied", () => {
      board.cells[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      board.cells[1] = [new Cell([0, 2]), new Cell([1]), new Cell([0, 2])];
      expect(
        apply_clue(
          {
            type: ClueType.Before,
            tiles: [
              [0, 0],
              [1, 1],
            ],
          },
          board,
        ),
      ).toBe(false);
    });

    test("removes options from ends", () => {
      expect(
        apply_clue(
          {
            type: ClueType.Before,
            tiles: [
              [0, 0],
              [1, 1],
            ],
          },
          board,
        ),
      ).toBe(true);
      expect([...board]).toEqual([
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([1, 2])],
        [new Cell([0, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });
});
