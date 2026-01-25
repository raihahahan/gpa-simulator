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

function splitByColumn(items: { x: number; text: string }[]) {
  const left: string[] = [];
  const right: string[] = [];

  for (const item of items) {
    if (item.x < 25) left.push(item.text);
    else right.push(item.text);
  }

  return [left.join(" ").trim(), right.join(" ").trim()].filter(Boolean);
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
        "",
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

  // for (const item of allTexts) {
  //   console.log(item);
  // }

  // group rows and columns
  const rows: Array<Array<{ x: number; text: string }>> = [];

  let currentRow: {
    y: number;
    items: Array<{ x: number; text: string }>;
  } | null = null;

  for (const item of allTexts) {
    if (!currentRow || Math.abs(item.y - currentRow.y) > 0.1) {
      if (currentRow) {
        rows.push(currentRow.items);
      }
      currentRow = {
        y: item.y,
        items: [{ x: item.x, text: item.text }],
      };
    } else {
      currentRow.items.push({ x: item.x, text: item.text });
    }
  }

  if (currentRow) {
    rows.push(currentRow.items);
  }

  // Course code regex patterns
  const gradeRegex = /^(A\+|A-|A|B\+|B-|B|C\+|C|D\+|D|F|S|CS|CU|-)$/;
  const unitsRegex = /^(\d+\.\d{2})$/;

  for (const row of rows) {
    const columns = splitByColumn(row);

    for (const colText of columns) {
      const parts = colText.split(" ");

      if (parts.length < 4) continue;

      const lastWord = parts[parts.length - 1];
      const secondLastWord = parts[parts.length - 2];

      if (!unitsRegex.test(lastWord)) continue;
      if (!gradeRegex.test(secondLastWord)) continue;

      const units = parseFloat(lastWord);
      const grade = secondLastWord;

      if (grade === "CS" || grade === "CU" || grade === "S" || grade === "-")
        continue;

      if (grade in GRADE_TO_GPA) {
        totalGradedUnits += units;
        totalGradePoints += GRADE_TO_GPA[grade] * units;
      }
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
      { status: 500 },
    );
  }
}
