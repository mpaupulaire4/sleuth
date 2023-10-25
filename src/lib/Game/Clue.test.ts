import { describe, test, expect } from "vitest";
import { ClueType, generate_clues } from "./Clue";

describe("generate_clues", () => {
  test("generates all clues", () => {
    const board = [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ];
    const rand = Math.random;
    Math.random = () => 0.5;

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

    Math.random = rand;
  });
});

describe("apply_clue", () => {
  describe("Exact", () => {
    test("works");
  });
  describe("Same", () => {
    test("works");
  });
  describe("Adjacent", () => {
    test("works");
  });
  describe("Sequential", () => {
    test("works");
  });
  describe("Before", () => {
    test("works");
  });
});
