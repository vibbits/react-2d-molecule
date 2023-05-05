import React from "react";

import * as V from "./vector";

type BondVariant =
  | "UNSPECIFIED"
  | "SINGLE"
  | "DOUBLE"
  | "TRIPPLE"
  | "QUADRUPLE"
  | "QUINTUPLE"
  | "HEXTUPLE"
  | "ONEANDAHALF"
  | "TWOANDAHALF"
  | "THREEANDAHALF"
  | "FOURANDAHALF"
  | "FIVEANDAHALF"
  | "AROMATIC"
  | "IONIC"
  | "HYDROGEN"
  | "THREECENTER"
  | "DATIVEONE"
  | "DATIVE"
  | "DATIVEL"
  | "DATIVER"
  | "OTHER"
  | "ZERO";

type BondDirection =
  | "BEGINWEDGE"
  | "BEGINDASH"
  | "ENDDOWNRIGHT"
  | "ENDUPRIGHT"
  | "EITHERDOUBLE"
  | "UNKNOWN";

type Bond = {
  source: number;
  sink: number;
  bond: BondVariant;
  direction?: BondDirection;
};

type Atom = {
  x: number;
  y: number;
  element: string;
  selected?: boolean;
};

export type MoleculeData = {
  width: number;
  height: number;
  atoms: Atom[];
  bonds: Bond[];
};

const SingleBond: React.FC<{ source: Atom; sink: Atom }> = ({
  source,
  sink,
}) => (
  <line
    x1={source.x}
    x2={sink.x}
    y1={source.y}
    y2={sink.y}
    stroke="black"
    strokeWidth="0.05"
  />
);

const DoubleBond: React.FC<{ source: Atom; sink: Atom }> = ({
  source,
  sink,
}) => {
  const dx = (sink.x - source.x) * 0.05;
  const dy = (sink.y - source.y) * 0.05;

  return (
    <g>
      <line
        x1={source.x - dy}
        x2={sink.x - dy}
        y1={source.y + dx}
        y2={sink.y + dx}
        stroke="black"
        strokeWidth="0.05"
      />
      <line
        x1={source.x + dy}
        x2={sink.x + dy}
        y1={source.y - dx}
        y2={sink.y - dx}
        stroke="black"
        strokeWidth="0.05"
      />
    </g>
  );
};

const Wedge: React.FC<{ source: Atom; sink: Atom }> = ({ source, sink }) => {
  const dx = (sink.x - source.x) * 0.15;
  const dy = (sink.y - source.y) * 0.15;
  const lengthScale = sink.element === "C" ? 1.0 : 0.75;
  const left = V.add(
    source,
    V.scale(V.sub({ x: sink.x + dy, y: sink.y - dx }, source), lengthScale),
  );
  const right = V.add(
    source,
    V.scale(V.sub({ x: sink.x - dy, y: sink.y + dx }, source), lengthScale),
  );

  return (
    <polygon
      points={`${source.x},${source.y} ${left.x},${left.y} ${right.x},${right.y}`}
      fill="black"
      stroke="black"
      strokeWidth="0.02"
    />
  );
};

const Dash: React.FC<{ bond: string; source: Atom; sink: Atom }> = ({
  bond,
  source,
  sink,
}) => {
  const lengthScale = sink.element === "C" ? 1.0 : 0.8;
  const dx = (sink.x - source.x) * 0.15;
  const dy = (sink.y - source.y) * 0.15;
  const endA = V.scale(
    V.sub({ x: sink.x + dy, y: sink.y - dx }, source),
    lengthScale,
  );
  const endB = V.scale(
    V.sub({ x: sink.x - dy, y: sink.y + dx }, source),
    lengthScale,
  );

  const NUM_DASHES = 6;
  const lines = Array.from({ length: NUM_DASHES }, (_, index) => {
    const frac = index / NUM_DASHES + 1 / (2 * NUM_DASHES);
    const left = V.add(source, V.scale(endA, frac));
    const right = V.add(source, V.scale(endB, frac));
    return (
      <line
        key={`${bond}-${index}`}
        x1={left.x}
        y1={left.y}
        x2={right.x}
        y2={right.y}
        stroke="black"
        strokeWidth="0.05"
      />
    );
  });

  return <g>{lines}</g>;
};

const UnimplementedBond: React.FC<{ source: Atom; sink: Atom }> = ({
  source,
  sink,
}) => {
  const x = (sink.x - source.x) / 2;
  const y = (sink.y - source.y) / 2;
  return (
    <text x={x} y={y} textAnchor="middle" style={{ fontSize: "0.1px" }}>
      ?unimplemented?
    </text>
  );
};

const Bonds: React.FC<{ molecule: MoleculeData }> = ({ molecule }) => {
  return (
    <>
      {molecule.bonds.map((bond: Bond, i: number) => {
        switch (`${bond.bond}-${bond.direction}`) {
          case "SINGLE-undefined":
            return (
              <SingleBond
                key={`singlebond-${i}`}
                source={molecule.atoms[bond.source] as Atom}
                sink={molecule.atoms[bond.sink] as Atom}
              />
            );
          case "SINGLE-BEGINWEDGE":
            return (
              <Wedge
                key={`wedge${i}`}
                source={molecule.atoms[bond.source] as Atom}
                sink={molecule.atoms[bond.sink] as Atom}
              />
            );
          case "SINGLE-BEGINDASH":
            return (
              <Dash
                key={`dash-${i}`}
                bond={`dash-${i}`}
                source={molecule.atoms[bond.source] as Atom}
                sink={molecule.atoms[bond.sink] as Atom}
              />
            );
          case "DOUBLE-undefined":
            return (
              <DoubleBond
                key={`doublebond-${i}`}
                source={molecule.atoms[bond.source] as Atom}
                sink={molecule.atoms[bond.sink] as Atom}
              />
            );
          default:
            return (
              <UnimplementedBond
                key={`unimplbond-${i}`}
                source={molecule.atoms[bond.source] as Atom}
                sink={molecule.atoms[bond.sink] as Atom}
              />
            );
        }
      })}
    </>
  );
};

type MoleculeProps = {
  molecule: MoleculeData;
  translateX?: number;
  translateY?: number;
  scale?: number;
  atomClicked?: (index: number) => void;
  atomStyle?: (element: string, selected: boolean) => React.CSSProperties;
  atomLabelStyle?: (element: string, selected: boolean) => React.CSSProperties;
};

export const Molecule: React.FC<MoleculeProps> = (props: MoleculeProps) => {
  const min_x = props.molecule.atoms
    .map((a: Atom) => a.x)
    .reduce((acc: number, v: number) => Math.min(acc, v), Infinity);
  const min_y = props.molecule.atoms
    .map((a: Atom) => a.y)
    .reduce((acc: number, v: number) => Math.min(acc, v), Infinity);

  const translateX =
    -Math.min(min_x, 0) + 0.3 + (props.translateX || 0) * props.molecule.width;
  const translateY =
    -Math.min(min_y, 0) + 0.3 + (props.translateY || 0) * props.molecule.height;

  const defaultAtomStyle = (
    element: string,
    _selected: boolean,
  ): React.CSSProperties => ({
    fill: element === "C" ? "rgba(1, 1, 1, 0)" : "white",
    stroke: element === "C" ? "rgba(1, 1, 1, 0)" : "white",
  });

  const defaultAtomLabelStyle = (
    element: string,
    _selected: boolean,
  ): React.CSSProperties => ({
    fill: element === "C" ? "rgba(0,0,0,0)" : "black",
  });

  const defaultAtomClicked = (_index: number) => {};

  const atomClicked = props.atomClicked ?? defaultAtomClicked;
  const atomStyle = props.atomStyle ?? defaultAtomStyle;
  const atomLabelStyle = props.atomLabelStyle ?? defaultAtomLabelStyle;

  return (
    <div
      style={{
        fontSize: "0.7px",
        fontFamily: "sans-serif",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${Math.ceil(props.molecule.width)} ${Math.ceil(
          props.molecule.height,
        )}`}
        style={{ pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id="dashes"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <path d="M-1 1 1-1M0 4 4 0M3 5 5 3" />
          </pattern>
          <mask id="dashes-mask">
            <rect height="100%" width="100%" style={{ fill: "url(#dashes)" }} />
          </mask>
        </defs>
        <g
          transform={`translate(${translateX}, ${translateY}) scale(${
            props.scale || 1
          } ${props.scale || 1})`}
        >
          <Bonds molecule={props.molecule} />
          {props.molecule.atoms.map((atom: Atom, i: number) => (
            <g
              key={`atom-${i}`}
              onClick={() => atomClicked(i)}
              style={{ pointerEvents: "visiblePainted", cursor: "crosshair" }}
            >
              <circle
                key={i}
                cx={atom.x}
                cy={atom.y}
                r={0.3}
                strokeWidth="0.02"
                style={atomStyle(atom.element, !!atom.selected)}
              />
              <text
                key={`label-${i}`}
                x={atom.x}
                y={atom.y + 0.25}
                textAnchor="middle"
                style={atomLabelStyle(atom.element, !!atom.selected)}
              >
                {atom.element}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
