export type Figure = {
  name: string;
  color: string;
  questions: string[];
};
//  triángulo, cuadrado, rombo, pentágono y corazón
export const figures: Figure[] = [
  {
    name: "Corazón",
    color: "ff0b0b",
    questions: ["Co1", "Co2", "Co3", "Co4"],
  },
  {
    name: "Cuadrado",
    color: "a233ff",
    questions: ["C1", "C2", "C3", "C4"],
  },
  {
    name: "Pentágono",
    color: "ff850b",
    questions: ["P1", "P2", "P3", "P4"],
  },
  {
    name: "Rombo",
    color: "ff0bc4",
    questions: ["R1", "R2", "R3", "R4"],
  },
  {
    name: "Triangulo",
    color: "ff5733",
    questions: ["T1", "T2", "T3", "T4"],
  },
];
