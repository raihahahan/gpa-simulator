import { Module } from "./types";

export const calculateGPA = (modules: Module[]): string => {
  modules = modules.filter((m) => !m.su);
  const totalCredits = modules.reduce((acc, module) => acc + module.credits, 0);
  const totalPoints = modules.reduce(
    (acc, module) => acc + module.credits * module.points,
    0
  );
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
};
