/**
 * Tests for Vector functions
 */

import { describe, expect, test } from "@jest/globals";
import * as V from "../src/vector";

describe("Vector functions", () => {
  test("Add any vector, V, to zero = V", () => {
    const zero = { x: 0, y: 0 };
    const vectors = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
    ];

    expect(vectors.map((v) => V.add(v, zero))).toStrictEqual(vectors);
  });

  test("Add 2 vectors", () => {
    expect(V.add({ x: 1, y: 1 }, { x: -1, y: -1 })).toStrictEqual({
      x: 0,
      y: 0,
    });
    expect(V.add({ x: 1, y: 0 }, { x: 1, y: 0 })).toStrictEqual({ x: 2, y: 0 });
    expect(V.add({ x: 1, y: 1 }, { x: -1, y: 1 })).toStrictEqual({
      x: 0,
      y: 2,
    });
  });

  test("Sub vector from itself is zero", () => {
    const zero = { x: 0, y: 0 };
    const vectors = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
    ];

    vectors.forEach((v) => expect(V.sub(v, v)).toStrictEqual(zero));
  });

  test("Subtract 2 vectors", () => {
    expect(V.sub({ x: 1, y: 2 }, { x: 0, y: 1 })).toStrictEqual({ x: 1, y: 1 });
    expect(V.sub({ x: -4, y: 4 }, { x: -2, y: 1 })).toStrictEqual({
      x: -2,
      y: 3,
    });
  });

  test("Dot of perpendicular vectors is zero", () => {
    expect(V.dot({ x: 0, y: 1 }, { x: 1, y: 0 })).toBeCloseTo(0);
    expect(V.dot({ x: -1, y: 1 }, { x: 1, y: 1 })).toBeCloseTo(0);
    expect(V.dot({ x: -1, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(0);
    expect(V.dot({ x: -1, y: -1 }, { x: -1, y: 1 })).toBeCloseTo(0);
    expect(V.dot({ x: 0, y: -1 }, { x: -1, y: 0 })).toBeCloseTo(0);
    expect(V.dot({ x: 1, y: -1 }, { x: -1, y: -1 })).toBeCloseTo(0);
    expect(V.dot({ x: 1, y: 0 }, { x: 0, y: -1 })).toBeCloseTo(0);
    expect(V.dot({ x: 1, y: 1 }, { x: 1, y: -1 })).toBeCloseTo(0);
  });

  test("Scale vectors", () => {
    expect(V.scale({ x: 0, y: 2 }, 0.5)).toStrictEqual({ x: 0, y: 1 });
    expect(V.scale({ x: 2, y: 2 }, -0.5)).toStrictEqual({ x: -1, y: -1 });
  });

  test("Vector length", () => {
    expect(V.length({ x: 1, y: 0 })).toBeCloseTo(1);
    expect(V.length({ x: 0, y: 3 })).toBeCloseTo(3);
  });
});
