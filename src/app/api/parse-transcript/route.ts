/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export interface ParsedTranscriptData {
  totalGradedUnits: number;
  currentGPA: number;
}

export interface CourseData {
  code: string;
  name: string;
  grade: string;
  units: number;
}

// NUS Grade to GPA mapping
const GRADE_TO_GPA: Record<string, number> = {
  "A+": 5.0,
  A: 5.0,
  "A-": 4.5,
  "B+": 4.0,
  B: 3.5,
  "B-": 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
};

interface PDFText {
  x: number;
  y: number;
  w: number;
  clr: number;
  sw: number;
  A: string;
  R: Array<{ T: string; S: number; TS: number[] }>;
}

interface PDFData {
  Pages: Array<{
    Texts: PDFText[];
  }>;
}

function parseTranscriptFromJSON(pdfData: PDFData): ParsedTranscriptData {
  let totalGradedUnits = 0;
  let totalGradePoints = 0;

  // Extract all text elements from all pages with their x,y coordinates
  const allTexts: Array<{ x: number; y: number; text: string }> = [];

  for (const page of pdfData.Pages) {
    for (const textItem of page.Texts) {
      // Decode the text (pdf2json uses URI encoding)
      const decodedText = textItem.R.map((r) => decodeURIComponent(r.T)).join(
        ""
      );
      if (decodedText.trim()) {
        // Only add non-empty texts
        allTexts.push({
          x: textItem.x,
          y: textItem.y,
          text: decodedText.trim(),
        });
      }
    }
  }

  // Sort by y position first, then x position (left to right, top to bottom)
  allTexts.sort((a, b) => {
    if (Math.abs(a.y - b.y) < 0.1) {
      return a.x - b.x; // Same line, sort by x (left to right)
    }
    return a.y - b.y; // Different lines, sort by y (top to bottom)
  });

  // Combine texts on the same line (same Y position within tolerance)
  const lines: Array<{ y: number; text: string }> = [];
  let currentLine: { y: number; texts: string[] } | null = null;

  for (const item of allTexts) {
    if (!currentLine || Math.abs(item.y - currentLine.y) > 0.1) {
      // Start a new line
      if (currentLine) {
        lines.push({
          y: currentLine.y,
          text: currentLine.texts.join(" "),
        });
      }
      currentLine = { y: item.y, texts: [item.text] };
    } else {
      // Add to current line
      currentLine.texts.push(item.text);
    }
  }

  // Don't forget the last line
  if (currentLine) {
    lines.push({
      y: currentLine.y,
      text: currentLine.texts.join(" "),
    });
  }

  // console.log("Combined lines:", lines);

  // Course code regex patterns
  const gradeRegex = /^(A\+|A-|A|B\+|B-|B|C\+|C|D\+|D|F|S|CS|CU|-)$/;
  const unitsRegex = /^(\d+\.\d{2})$/;

  // Process each line to find courses
  for (const line of lines) {
    const parts = line.text.split(" ");

    if (parts.length < 4) continue; // Need at least: CODE NAME GRADE UNITS

    // Check last 2 words for GRADE UNITS pattern
    const lastWord = parts[parts.length - 1];
    const secondLastWord = parts[parts.length - 2];

    // Check if last word is units and second last is a grade
    if (!unitsRegex.test(lastWord)) continue;
    if (!gradeRegex.test(secondLastWord)) continue;

    const units = parseFloat(lastWord);
    const grade = secondLastWord;
    console.log(lastWord, secondLastWord);
    console.log(units, grade);

    // Skip if grade is CS (S/U) - we only want graded courses
    if (grade === "CS" || grade === "CU" || grade === "S" || grade === "-")
      continue;

    // Calculate GPA for graded courses only
    if (grade in GRADE_TO_GPA) {
      totalGradedUnits += units;
      totalGradePoints += GRADE_TO_GPA[grade] * units;
    }
  }

  const currentGPA =
    totalGradedUnits > 0 ? totalGradePoints / totalGradedUnits : 0;

  return {
    totalGradedUnits,
    currentGPA: Number(currentGPA.toFixed(2)),
  };
}

async function parsePDF(buffer: Buffer): Promise<PDFData> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(errData));
    });

    pdfParser.on("pdfParser_dataReady", (data: any) => {
      resolve(data as PDFData);
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("transcript") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF to JSON
    const pdfData = await parsePDF(buffer);

    // Parse transcript from JSON structure
    const result = parseTranscriptFromJSON(pdfData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error parsing transcript:", error);
    return NextResponse.json(
      {
        error: "Failed to parse transcript",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
