export interface Grade {
  grade: string; // Example: "A+", "B"
  points: number; // Example: 5.0, 4.5
}

export interface Module {
  name: string; // Module name, e.g., "CS1010"
  grade: string; // Grade, e.g., "A+"
  credits: number; // Credits for the module
  points: number; // Calculated grade points
  su: boolean;
}
