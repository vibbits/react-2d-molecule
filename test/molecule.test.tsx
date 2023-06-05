/**
 * Tests for the Molecule component
 */

import { describe, expect, test, jest } from "@jest/globals";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import type { MoleculeData } from "../src/index";
import { Molecule } from "../src/index";

describe("Molecule component", () => {
  test("Display a hydrogen", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [{ x: 5, y: 5, element: "H" }],
      bonds: [],
    };
    render(<Molecule molecule={data} />);

    expect(screen.queryByText("H")).not.toBeNull();
  });

  test("Display a single bond between carbons", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "C" },
        { x: 10, y: 10, element: "C" },
      ],
      bonds: [{ atoms: [0, 1], bond: "SINGLE" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // carbon atom labels should not be displayed
    expect(screen.queryAllByText("C")).toHaveLength(2);

    // The line
    expect(container.querySelector("line")).not.toBeNull();
  });

  test("Display a double bond", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "Cl" },
        { x: 10, y: 10, element: "Cl" },
      ],
      bonds: [{ atoms: [0, 1], bond: "DOUBLE" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // chlorine atom labels should  displayed
    expect(screen.queryAllByText("Cl")).toHaveLength(2);

    // The lines
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });

  test("Display a wedge single bond", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "Cl" },
        { x: 10, y: 10, element: "H" },
      ],
      bonds: [{ atoms: [0, 1], bond: "SINGLE", direction: "BEGINWEDGE" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // atom labels should  displayed
    expect(screen.queryByText("Cl")).not.toBeNull();
    expect(screen.queryByText("H")).not.toBeNull();

    // The polygon
    expect(container.querySelector("polygon")).not.toBeNull();
  });

  test("Display a wedge single bond ending with a Carbon atom", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "Cl" },
        { x: 10, y: 10, element: "C" },
      ],
      bonds: [{ atoms: [0, 1], bond: "SINGLE", direction: "BEGINWEDGE" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // atom labels should  displayed
    expect(screen.queryByText("Cl")).not.toBeNull();
    expect(screen.queryByText("C")).not.toBeNull();

    // The polygon
    expect(container.querySelector("polygon")).not.toBeNull();
  });

  test("Display a dash single bond", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "Cl" },
        { x: 5, y: 5, element: "H" },
      ],
      bonds: [{ atoms: [0, 1], bond: "SINGLE", direction: "BEGINDASH" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // atom labels should  displayed
    expect(screen.queryByText("Cl")).not.toBeNull();
    expect(screen.queryByText("H")).not.toBeNull();

    // The polygon
    expect(container.querySelectorAll("line")).toHaveLength(6);
  });

  test("Display a dash single bond ending with a Carbon atom", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "Cl" },
        { x: 5, y: 5, element: "C" },
      ],
      bonds: [{ atoms: [0, 1], bond: "SINGLE", direction: "BEGINDASH" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // atom labels should  displayed
    expect(screen.queryByText("Cl")).not.toBeNull();
    expect(screen.queryByText("C")).not.toBeNull();

    // The polygon
    expect(container.querySelectorAll("line")).toHaveLength(6);
  });

  test("Display aromatic ring", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 1, y: 0, element: "F" },
        { x: 2, y: 1, element: "F" },
        { x: 2, y: 2, element: "F" },
        { x: 1, y: 3, element: "F" },
        { x: 0, y: 2, element: "F" },
        { x: 0, y: 1, element: "F" },
      ],
      bonds: [{ atoms: [0, 1, 2, 3, 4, 5], bond: "AROMATIC" }],
    };
    const { container } = render(<Molecule molecule={data} />);

    // atom labels should  displayed
    expect(screen.queryAllByText("F")).toHaveLength(6);

    // The polygon
    expect(container.querySelectorAll("line")).toHaveLength(9);
  });

  test("Empty aromatic ring", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [{ x: 5, y: 5, element: "A" }],
      bonds: [{ atoms: [], bond: "AROMATIC" }],
    };

    const { container } = render(<Molecule molecule={data} />);

    expect(screen.queryAllByText("A")).toHaveLength(1);
    expect(container.querySelectorAll("line")).toHaveLength(0);
  });

  test("Display an unimplemented bond type", () => {
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [
        { x: 0, y: 0, element: "Cl" },
        { x: 5, y: 5, element: "H" },
      ],
      bonds: [{ atoms: [0, 1], bond: "UNSPECIFIED" }],
    };
    render(<Molecule molecule={data} />);

    // atom labels should  displayed
    expect(screen.queryByText("Cl")).not.toBeNull();
    expect(screen.queryByText("H")).not.toBeNull();

    // The unimplemented label
    expect(screen.queryByText("?UNSPECIFIED-?")).not.toBeNull();
  });

  test("Carbons respond to button clicks", () => {
    const onClick = jest.fn();
    const data: MoleculeData = {
      width: 10,
      height: 10,
      atoms: [{ x: 0, y: 0, element: "C" }],
      bonds: [],
    };
    render(<Molecule molecule={data} atomClicked={onClick} />);

    fireEvent.click(screen.getByText("C"));

    // atom labels should  displayed, C should be clicked
    expect(screen.queryByText("C")).not.toBeNull();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
