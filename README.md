# react-2d-molecule

`@vibbioinfocore/react-2d-molecule` is a React component to display molecule structures in a 2D SVG.

## Installation

Typescript type definitions are included.

* NPM

```bash
npm install @vibbioinfocore/react-2d-molecule
```

* Yarn

```bash
yarn add @vibbioinfocore/react-2d-molecule
```

## Usage

```jsx
import React from 'react';
import { Molecule } from '@vibbioinfocore/react-2d-molecule';

const mol = {
  "width": 3.0,
  "height": 3.0,
  "atoms": [
    {"x": 1.5, "y": -0.0, "element": "H"},
    {"x": -1.5, "y": 0.0, "element": "H"},
    {"x": 0.0, "y": 1.5, "element": "H"},
    {"x": 0.0, "y": -0.0, "element": "C"},
    {"x": -0.0, "y": -1.5, "element": "H"}
  ],
  "bonds": 
    {"source": 3, "sink": 0, "bond": "SINGLE"},
    {"source": 3, "sink": 1, "bond": "SINGLE"},
    {"source": 3, "sink": 2, "bond": "SINGLE"},
    {"source": 3, "sink": 4, "bond": "SINGLE"}
  ]
};

export ViewAMolecule = () => <Molecule molecule={mol} />;
```

## Component Attributes

### Required

* `molecule: MoleculeData` A description of the molecule to display.

### Optional

* `translateX` Translate the whole image on the X axis (default: `0`).
* `translateY` Translate the whole image on the Y axis (default: `0`).
* `scale` Scale the whole image by some fraction (default: `1`).
* `atomClicked` A callback function accepting the index of the clicked atom.
* `atomStyle` A hook specifying CSS styles for the SVG `<circle>`.
* `atomLabelStyle` A hook specifying CSS styles for the SVG `<text>`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
