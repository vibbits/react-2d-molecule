import React, { useState, useRef, useEffect } from "react";

import type { MoleculeData } from "@vibbioinfocore/react-2d-molecule";
import { Molecule } from "@vibbioinfocore/react-2d-molecule";

export const App: React.FC<{}> = () => {
  const [json, setJson] = useState<string>("");

  let mol = null;
  try {
    mol = JSON.parse(json);
  } catch (error) {}

  return (
    <>
      <h1>Render Molecule</h1>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
      ></textarea>
      {mol === null ? (
        <div>Not valid data</div>
      ) : (
        <DisplayMolecule data={mol} />
      )}
    </>
  );
};

const DisplayMolecule: React.FC<{ data: MoleculeData }> = ({ data }) => {
  const [[translateX, translateY], setTranslate] = useState([0, 0]);
  const [mayTranslate, setMayTranslate] = useState(false);
  const [scale, setScale] = useState(0.9);
  const [mol, setMol] = useState<MoleculeData>(data);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (index: number) => {
    setMol((m: MoleculeData) => {
      const newAtoms = m.atoms.map((a, i) =>
        index === i ? { ...a, selected: !!!a.selected } : { ...a },
      );
      return { ...m, atoms: newAtoms };
    });
  };

  const atomStyle = (element: string, selected: boolean) => {
    return {
      fill: selected ? "#ffcccc" : element === "C" ? "rgba(1,1,1,0)" : "white",
      stroke: selected
        ? "#ffcccc"
        : element === "C"
        ? "rgba(1,1,1,0)"
        : "white",
    };
  };

  const atomLabelStyle = (element: string, selected: boolean) => ({
    fill: selected ? "red" : element === "C" ? "none" : "black",
  });

  const handleWheel = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setScale((s) => (evt.deltaY < 0 ? s + 0.05 : s - 0.05));
  };

  useEffect(() => {
    if (!containerRef) return;
    containerRef.current.addEventListener("wheel", handleWheel, {
      passive: false,
    });
  }, []);

  return (
    <div>
      <h3>Interactive</h3>
      <div
        ref={containerRef}
        onPointerMove={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          if (mayTranslate) {
            window.requestAnimationFrame(() => {
              const bbox = containerRef.current.getBoundingClientRect();
              setTranslate(([t_x, t_y]) => [
                t_x + evt.movementX / bbox.width,
                t_y + evt.movementY / bbox.height,
              ]);
            });
          }
        }}
        onPointerDown={() => setMayTranslate(true)}
        onPointerUp={() => setMayTranslate(false)}
        style={{
          width: "90%",
          fontSize: "0.7px",
          fontFamily: "sans-serif",
          border: "1px solid red",
        }}
      >
        <Molecule
          molecule={mol}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          atomClicked={handleClick}
          atomStyle={atomStyle}
          atomLabelStyle={atomLabelStyle}
        />
      </div>
      <h3>Non-interactive</h3>
      <div
        style={{
          width: "90%",
          fontSize: "0.65px",
          fontFamily: "sans-serif",
          border: "1px solid blue",
        }}
      >
        <Molecule molecule={mol} />
      </div>
    </div>
  );
};
