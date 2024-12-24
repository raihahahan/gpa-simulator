import { GRADES } from "@/common/data";

export function calculateRequiredAverageGrade(
  currentGPA: number,
  currentUnits: number,
  desiredGPA: number,
  unitsLeft: number
): number {
  if (unitsLeft <= 0) {
    return -2; // "Invalid units left"; // Ensure units left is positive
  }

  const currentPoints = currentGPA * currentUnits;

  const desiredPoints = desiredGPA * (currentUnits + unitsLeft);

  const neededPoints = desiredPoints - currentPoints;

  const totalModulesLeft = unitsLeft / 4;

  const averageGradeNeeded = neededPoints / totalModulesLeft;

  if (averageGradeNeeded > GRADES[0].points) {
    return -1; //"The required GPA is too high for the remaining units.";
  }

  return averageGradeNeeded;
}
