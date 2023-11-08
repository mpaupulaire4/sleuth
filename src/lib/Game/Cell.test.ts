import { describe, test, expect } from "vitest";
import { Cell } from "./Cell";

describe("Cell", () => {
  test("can check if it is an id", () => {
    expect(new Cell([0]).is(0)).toBe(true);
    expect(new Cell([0]).is(1)).toBe(false);

    expect(new Cell([0, 2]).is(0)).toBe(false);
    expect(new Cell([0, 2]).is(1)).toBe(false);
  });

  test("can toggle values", () => {
    const cell = new Cell([0, 1]);
    expect(cell.has(0)).toBe(true);
    cell.toggle(0)
    expect(cell.has(0)).toBe(false);
    expect(cell.has(1)).toBe(true);
    cell.toggle(0)
    expect(cell.has(0)).toBe(true);
    expect(cell.has(1)).toBe(true);
  });
});
