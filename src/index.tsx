import React from "react";

import * as V from "./vector";

export type BondVariant =
  | "UNSPECIFIED"
  | "SINGLE"
  | "DOUBLE"
  | "TRIPLE"
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

export type BondDirection =
  | "BEGINWEDGE"
  | "BEGINDASH"
  | "EITHERDOUBLE"
  | "UNKNOWN";

export type Bond = {
  atoms: Array<[number, number, BondVariant]>;
  direction?: BondDirection;
  tag?: "RING";
};

export type Atom = {
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
    strokeLinecap="round"
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
        strokeLinecap="round"
      />
      <line
        x1={source.x + dy}
        x2={sink.x + dy}
        y1={source.y - dx}
        y2={sink.y - dx}
        stroke="black"
        strokeWidth="0.05"
        strokeLinecap="round"
      />
    </g>
  );
};

const TripleBond: React.FC<{ source: Atom; sink: Atom }> = ({
  source,
  sink,
}) => {
  const dx = (sink.x - source.x) * 0.05;
  const dy = (sink.y - source.y) * 0.05;

  return (
    <g>
      <line
        x1={source.x}
        x2={sink.x}
        y1={source.y}
        y2={sink.y}
        stroke="black"
        strokeWidth="0.05"
        strokeLinecap="round"
      />
      <line
        x1={source.x - dy}
        y1={source.y + dx}
        x2={sink.x - dy}
        y2={sink.y + dx}
        stroke="black"
        strokeWidth="0.05"
        strokeLinecap="round"
      />
      <line
        x1={source.x + dy}
        y1={source.y - dx}
        x2={sink.x + dy}
        y2={sink.y - dx}
        stroke="black"
        strokeWidth="0.05"
        strokeLinecap="round"
      />
    </g>
  );
};

const EitherDoubleBond: React.FC<{ source: Atom; sink: Atom }> = ({
  source,
  sink,
}) => {
  const dir = V.scale(V.sub(sink, source), 0.1);
  const dx = (sink.x - source.x) * 0.1;
  const dy = (sink.y - source.y) * 0.1;
  const ep1 = V.sub({ x: sink.x - dy, y: sink.y + dx }, dir);
  const ep2 = V.add({ x: source.x - dy, y: source.y + dx }, dir);
  return (
    <g>
      <line
        x1={source.x}
        y1={source.y}
        x2={ep1.x}
        y2={ep1.y}
        stroke="black"
        strokeWidth="0.05"
        strokeLinecap="round"
      />
      <line
        x1={sink.x}
        y1={sink.y}
        x2={ep2.x}
        y2={ep2.y}
        stroke="black"
        strokeWidth="0.05"
        strokeLinecap="round"
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

const InsetBond: React.FC<{ source: Atom; sink: Atom; centre: V.Vector }> = ({
  source,
  sink,
  centre,
}) => {
  const a = V.add(source, V.scale(V.sub(centre, source), 0.1));
  const b = V.add(sink, V.scale(V.sub(centre, sink), 0.1));
  return (
    <line
      x1={a.x}
      x2={b.x}
      y1={a.y}
      y2={b.y}
      stroke="black"
      strokeWidth="0.05"
      strokeLinecap="round"
    />
  );
};

const Ring: React.FC<{
  bond: string;
  atoms: Array<[Atom, Atom, BondVariant]>;
}> = ({ bond, atoms }) => {
  return (
    <g>
      {atoms.map(([source, sink, variant], i) => {
        if (variant === "DOUBLE") {
          return (
            <g key={`${bond}-double-${i}`}>
              <SingleBond source={source} sink={sink} />
              <InsetBond
                source={source}
                sink={sink}
                centre={V.mean(atoms.flatMap((x) => [x[0], x[1]]))}
              />
            </g>
          );
        } else {
          return (
            <SingleBond
              key={`${bond}-single-${i}`}
              source={source}
              sink={sink}
            />
          );
        }
      })}
    </g>
  );
};

const UnimplementedBond: React.FC<{
  source: Atom;
  sink: Atom;
  name: string;
}> = ({ source, sink, name }) => {
  const x = (sink.x + source.x) / 2;
  const y = (sink.y + source.y) / 2;
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      style={{ fontSize: "0.1px", color: "red" }}
    >
      {`?${name}?`}
    </text>
  );
};

const Bonds: React.FC<{ molecule: MoleculeData }> = ({ molecule }) => {
  return (
    <>
      {molecule.bonds.map((bond: Bond, i: number) => {
        if (bond.tag === "RING") {
          return (
            <Ring
              key={`ring-${i}`}
              bond={`ring-${i}`}
              atoms={bond.atoms.map(
                ([f, t, v]: [number, number, BondVariant]) => [
                  molecule.atoms[f]!,
                  molecule.atoms[t]!,
                  v,
                ],
              )}
            />
          );
        } else {
          return bond.atoms.flatMap(
            ([source, sink, bondType]: [number, number, BondVariant]) => {
              const descr = `${bondType}-${
                bond.direction ? bond.direction : ""
              }`;
              const f: Atom = molecule.atoms[source]!;
              const t: Atom = molecule.atoms[sink]!;
              switch (descr) {
                case "SINGLE-":
                  return (
                    <SingleBond key={`singlebond-${i}`} source={f} sink={t} />
                  );
                case "SINGLE-BEGINWEDGE":
                  return <Wedge key={`wedge${i}`} source={f} sink={t} />;
                case "SINGLE-BEGINDASH":
                  return (
                    <Dash
                      key={`dash-${i}`}
                      bond={`dash-${i}`}
                      source={f}
                      sink={t}
                    />
                  );
                case "DOUBLE-":
                  return (
                    <DoubleBond key={`doublebond-${i}`} source={f} sink={t} />
                  );
                case "TRIPLE-":
                  return (
                    <TripleBond key={`triplebond-${i}`} source={f} sink={t} />
                  );
                case "DOUBLE-EITHERDOUBLE":
                  return (
                    <EitherDoubleBond
                      key={`eitherdouble-${i}`}
                      source={f}
                      sink={t}
                    />
                  );
                default:
                  return (
                    <UnimplementedBond
                      key={`unimplbond-${i}`}
                      source={f}
                      sink={t}
                      name={descr}
                    />
                  );
              }
            },
          );
        }
      })}
    </>
  );
};

const ATOM_RADIUS: number = 0.3;

type MoleculeProps = {
  molecule: MoleculeData;
  translateX?: number;
  translateY?: number;
  scale?: number;
  width?: number;
  height?: number;
  labelTranslateX?: number;
  labelTranslateY?: number;
  atomClicked?: (_index: number) => void;
  atomLabel?: (_atom: Atom, _index: number) => string;
  atomStyle?: (_element: string, _selected: boolean) => React.CSSProperties;
  atomLabelStyle?: (
    _element: string,
    _selected: boolean,
  ) => React.CSSProperties;
};

export const Molecule: React.FC<MoleculeProps> = (props: MoleculeProps) => {
  const [min_x, min_y] = props.molecule.atoms
    .map((a: Atom): [number, number] => [a.x, a.y])
    .reduce(
      ([acc_x, acc_y]: [number, number], [v_x, v_y]: [number, number]) => [
        Math.min(acc_x, v_x),
        Math.min(acc_y, v_y),
      ],
      [Infinity, Infinity],
    );

  const translateX =
    -(Math.min(min_x, 0) - ATOM_RADIUS) + (props.translateX || 0);
  const translateY =
    -(Math.min(min_y, 0) - ATOM_RADIUS) + (props.translateY || 0);

  const defaultAtomLabel = (atom: Atom, _index: number): React.ReactElement => (
    <>{atom.element}</>
  );

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
  const atomLabel = props.atomLabel ?? defaultAtomLabel;
  const atomStyle = props.atomStyle ?? defaultAtomStyle;
  const atomLabelStyle = props.atomLabelStyle ?? defaultAtomLabelStyle;
  const parentAspectRatio = (props.width || 1) / (props.height || 1);
  const width = props.molecule.width + 2 * ATOM_RADIUS;
  const height = (props.molecule.width + 2 * ATOM_RADIUS) / parentAspectRatio;
  const scale =
    props.scale ||
    Math.min(height / (props.molecule.height + 2 * ATOM_RADIUS), 1);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={props.width || 100}
      height={props.height || 100}
      style={{ pointerEvents: "none" }}
    >
      <g
        transform={`translate(${scale * translateX}, ${
          scale * translateY
        }) scale(${scale} ${scale})`}
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
              r={ATOM_RADIUS}
              strokeWidth="0.02"
              style={atomStyle(atom.element, !!atom.selected)}
            />
            <text
              key={`label-${i}`}
              x={atom.x + (props.labelTranslateX || 0)}
              y={atom.y + (props.labelTranslateY || 0.25)}
              textAnchor="middle"
              style={atomLabelStyle(atom.element, !!atom.selected)}
            >
              {atomLabel(atom, i)}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};
