import React, { useState, useRef, useEffect } from "react";

import type { Atom, MoleculeData } from "@vibbioinfocore/react-2d-molecule";
import { Molecule } from "@vibbioinfocore/react-2d-molecule";

const PAGE_SIZE = 12;

const parseMol = (text: string): MoleculeData | null => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const App: React.FC<{}> = () => {
  const table = useRef(null);
  const [mols, setMols] = useState<Array<MoleculeData | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [page, setPage] = useState<number>(0);
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
  const [mol, setMol] = useState<MoleculeData | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    for (let offset = 0; offset < PAGE_SIZE; offset++) {
      if (files[page + offset] !== undefined) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMols((ms) =>
            ms.map((f, i) =>
              i === offset ? parseMol(e.target.result as string) : f,
            ),
          );
        };
        reader.readAsText(files[page + offset]);
      }
    }
  }, [files, page]);

  const readTheFiles = (theFiles, thePage) => {
    for (let offset = 0; offset < PAGE_SIZE; offset++) {
      if (theFiles[thePage + offset] !== undefined) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMols((ms) =>
            ms.map((f, i) =>
              i === offset ? parseMol(e.target.result as string) : f,
            ),
          );
        };
        reader.readAsText(theFiles[thePage + offset]);
      }
    }
  };

  const changeTheFiles = (theFiles) => {
    setFiles(theFiles);
    readTheFiles(theFiles, page);
  };

  const pageLeft = () => {
    const newPage = Math.max(0, page - PAGE_SIZE);
    setPage(newPage);
    readTheFiles(files, newPage);
  };

  const pageRight = () => {
    const newPage = Math.min(files.length, page + PAGE_SIZE);
    setPage(newPage);
    readTheFiles(files, newPage);
  };

  const aspectRatio = (): [number, number] => {
    const { width, height } = table.current.getBoundingClientRect();
    console.log(width / 3, height / 4);
    return [width / 3, height / 4];
  };

  const updateAspectRatio = () => setDimensions(aspectRatio());

  useEffect(() => {
    updateAspectRatio();
    window.addEventListener("resize", updateAspectRatio);
    return () => removeEventListener("resize", updateAspectRatio);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Render Molecule</h1>
      <input
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        // @ts-ignore
        onChange={(e) => changeTheFiles(e.target.files)}
      />
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <button onClick={pageLeft}>&lt;</button>
        <div>
          <span>
            {page}/{files.length}
          </span>
        </div>
        <button onClick={pageRight}>&gt;</button>
      </div>
      <div
        ref={table}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "250px 250px 250px 250px",
        }}
      >
        {mols
          .filter((mol) => mol !== null)
          .map((mol, cell) => {
            return (
              <div
                key={`cell-${cell}`}
                style={{
                  fontSize: "0.65px",
                  fontFamily: "sans-serif",
                  border: "1px solid blue",
                  position: "relative",
                }}
              >
                <Molecule
                  molecule={mol}
                  width={dimensions[0]}
                  height={dimensions[1]}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 1,
                    right: 5,
                    fontSize: "12px",
                  }}
                >
                  {files[page + cell].name.replace(".json", "")}
                </div>
              </div>
            );
          })}
      </div>
      <textarea onChange={(e) => setMol(parseMol(e.target.value))}></textarea>
      {mol === null ? (
        <p>Not a valid molecule</p>
      ) : (
        <DisplayMolecule data={mol} />
      )}
    </div>
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

  const atomLabel = (atom: Atom, index: number): React.ReactElement => (
    <>
      {atom.element}
      <tspan dy="0.1" style={{ fontSize: "0.3px" }}>
        {index}
      </tspan>
    </>
  );

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "450px",
      }}
    >
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
            fontSize: "0.6px",
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
            atomLabel={atomLabel}
            atomStyle={atomStyle}
            atomLabelStyle={atomLabelStyle}
          />
        </div>
      </div>
      <div>
        <h3>Non-interactive</h3>
        <div
          style={{
            fontSize: "0.65px",
            fontFamily: "sans-serif",
            border: "1px solid blue",
          }}
        >
          <Molecule molecule={mol} />
        </div>
      </div>
    </div>
  );
};
