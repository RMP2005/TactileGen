export interface SampleDiagram {
  id: string;
  name: string;
  category: string;
  description: string;
  imagePath: string;
}

export const SAMPLE_DIAGRAMS: SampleDiagram[] = [
  {
    id: "sample_cell",
    name: "Biology Cell Structure",
    category: "Life Sciences",
    description: "Animal cell diagram with nucleus, mitochondria, and cell membrane callouts.",
    imagePath: "/samples/sample_cell.png"
  },
  {
    id: "sample_circuit",
    name: "Electric Circuit Schematic",
    category: "Physics",
    description: "DC circuit with battery source, resistor network, and capacitor plates.",
    imagePath: "/samples/sample_circuit.png"
  },
  {
    id: "sample_optics",
    name: "Optics Ray Diagram",
    category: "Physics / Optics",
    description: "Convex lens focal trace with principal optical axis, object, and real image.",
    imagePath: "/samples/sample_optics.png"
  }
];
