import { Grade } from "../features/grading/types";

export const data = {
  instructions: [
    "Add the courses you have completed or wish to simulate.",
    "Once done, you may export a json data of this and import it back in the future.`",
    "You may also choose to ignore CS/CU mods or mods that you have S/U'ed.",
    "Try out the simulator below too.",
  ],
  title: "NUS GPA Calculator",
  description: "Calculate and simulate your NUS GPA",
  githubLink: "https://github.com/raihahahan/gpa-simulator",
};

export const TOTAL_MC = 160;

export const GRADES: Grade[] = [
  { grade: "A+", points: 5.0 },
  { grade: "A", points: 5.0 },
  { grade: "A-", points: 4.5 },
  { grade: "B+", points: 4.0 },
  { grade: "B", points: 3.5 },
  { grade: "B-", points: 3.0 },
  { grade: "C+", points: 2.5 },
  { grade: "C", points: 2.0 },
  { grade: "D+", points: 1.5 },
  { grade: "D", points: 1.0 },
  { grade: "F", points: 0.0 },
  { grade: "CS/CU", points: 0.0 },
];

export const gradePoints = {
  "A+": 5.0,
  A: 5.0,
  "A-": 4.5,
  "B+": 4.0,
  B: 3.5,
  "B-": 3.0,
  "C+": 2.5,
  C: 2.0,
  "C-": 1.5,
  "D+": 1.0,
  D: 0.5,
  F: 0.0,
} as const;
