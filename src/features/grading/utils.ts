import { Module } from "./types";

export const calculateGPA = (modules: Module[]): string => {
  modules = modules.filter((m) => !m.su && m.grade != "CS/CU");
  const totalCredits = modules.reduce((acc, module) => acc + module.credits, 0);
  const totalPoints = modules.reduce(
    (acc, module) => acc + module.credits * module.points,
    0
  );
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
};

export const calculateSuCount = (modules: Module[]): number => {
  return modules.filter((m) => m.su).length;
};

export const calculateGradedUnits = (modules: Module[]): number => {
  return modules.reduce(
    (acc, module) =>
      !module.su && module.grade != "CS/CU" ? acc + module.credits : acc,
    0
  );
};
