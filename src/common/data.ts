import { Grade } from "../features/grading/types";

export const data = {
  instructions: [
    "Add the courses you have completed or wish to simulate.",
    "Once done, you may export a json data of this and import it back in the future.`",
  ],
  title: "NUS GPA Simulator",
  description: "Simulate your NUS GPA",
};

export const gradeData = [
  { letterGrade: "A+", gradePoint: 5 },
  { letterGrade: "A", gradePoint: 5 },
  { letterGrade: "A-", gradePoint: 4.5 },
  { letterGrade: "B+", gradePoint: 4 },
  { letterGrade: "B", gradePoint: 3.5 },
  { letterGrade: "B-", gradePoint: 3 },
  { letterGrade: "C+", gradePoint: 2.5 },
  { letterGrade: "C", gradePoint: 2 },
  { letterGrade: "D+", gradePoint: 1.5 },
  { letterGrade: "D", gradePoint: 1 },
  { letterGrade: "F", gradePoint: 0 },
];

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
