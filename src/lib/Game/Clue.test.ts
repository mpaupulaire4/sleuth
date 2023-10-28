import { describe, test, expect, beforeEach } from "vitest";
import { ClueType, apply_clue, generate_clues } from "./Clue";
import { Cell } from "./Cell";
import { generate_board, type iBoard, type iSolvedBoard } from "./Board";

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
  let board: iBoard = [];

  beforeEach(() => {
    board = generate_board(3);
  });

  describe("Exact", () => {
    test("does nothing if already set", () => {
      board[0][0] = new Cell([0]);
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
      expect(board).toEqual([
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
      expect(board).toEqual([
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
      board[0][0] = new Cell([0]);
      board[1][0] = new Cell([0]);
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
      board[0][0] = new Cell([1]);
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
      expect(board).toEqual([
        [new Cell([1]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);

      board = generate_board(3);
      board[1][0] = new Cell([1]);
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
      expect(board).toEqual([
        [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([1]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });

    test("sets cell if twin is set", () => {
      board[0][0] = new Cell([0]);
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
      expect(board).toEqual([
        [new Cell([0]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);

      board = generate_board(3);
      board[1][0] = new Cell([0]);
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
      expect(board).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([0]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });

  describe("Adjacent", () => {
    test("does nothing if already applied", () => {
      board[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      board[1] = [new Cell([0, 2]), new Cell([1]), new Cell([0, 2])];
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
      board[0] = [new Cell([1, 2]), new Cell([0]), new Cell([1, 2])];
      board[1] = [new Cell([1]), new Cell([0, 2]), new Cell([0, 2])];
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
      board[0] = [new Cell([0, 1, 2]), new Cell([1, 2]), new Cell([1, 2])];
      board[1] = [
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
      expect(board).toEqual([
        [new Cell([0, 1, 2]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([1, 2]), new Cell([0, 1, 2]), new Cell([1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });

    test("sets others if already set", () => {
      board[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      board[1] = [new Cell([0, 2]), new Cell([1, 0, 2]), new Cell([0, 1, 2])];
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
      expect(board).toEqual([
        [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])],
        [new Cell([2]), new Cell([0]), new Cell([1])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });
  describe("Sequential", () => {
    test("works");
  });
  describe("Before", () => {
    test("does nothing if already applied", () => {
      board[0] = [new Cell([0]), new Cell([1, 2]), new Cell([1, 2])];
      board[1] = [new Cell([0, 2]), new Cell([1]), new Cell([0, 2])];
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
      expect(board).toEqual([
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([1, 2])],
        [new Cell([0, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
        [new Cell([0, 1, 2]), new Cell([0, 1, 2]), new Cell([0, 1, 2])],
      ]);
    });
  });
});
