"use client";
import { useState } from "react";
import { NumberInput, Button, Text, Group, FileInput } from "@mantine/core";
import ComponentWrapper from "@/common/wrapper";
import { useGlobalMediaQuery } from "@/common/hooks";
import { data, GRADES } from "@/common/data";
import Image from "next/image";

interface ParsedTranscriptData {
  totalGradedUnits: number;
  currentGPA: number;
  courses: Array<{
    code: string;
    name: string;
    grade: string;
    units: number;
  }>;
}

interface SimulateResults {
  required: number;
  maxAchievable: number;
}

export default function GradeSimulator() {
  const [currentGPA, setCurrentGPA] = useState<number>(0);
  const [currentUnits, setCurrentUnits] = useState<number>(0);
  const [desiredGPA, setDesiredGPA] = useState<number>(0);
  const [unitsLeft, setUnitsLeft] = useState<number>(0);
  const [result, setResult] = useState<string | SimulateResults>("");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { xs } = useGlobalMediaQuery();

  function calculateRequiredGPA(
    currentGPA: number,
    completedUnits: number,
    plannedUnits: number,
    desiredGPA: number,
  ): { required: number; maxAchievable: number } | string {
    if (plannedUnits <= 0) {
      return "Invalid units left";
    }

    const totalPointsRequired = desiredGPA * (completedUnits + plannedUnits);
    const currPoints = currentGPA * completedUnits;
    const requiredPoints = totalPointsRequired - currPoints;
    const requiredGPA = requiredPoints / plannedUnits;
    const maxRequiredPoints = GRADES[0].points * plannedUnits;
    const maxTotalPointsRequired = maxRequiredPoints + currPoints;
    const achievable = maxTotalPointsRequired / (completedUnits + plannedUnits);

    const A = GRADES[0].points; // 5.0
    const unitsPerModule = 4;

    const numerator = desiredGPA * completedUnits - currPoints;
    const denominator = unitsPerModule * (A - desiredGPA);

    // denominator > 0 because desiredGPA < 5.0
    const extraModules = Math.ceil(numerator / denominator);

    if (requiredGPA > GRADES[0].points) {
      return `Your desired GPA is too high as you will need a GPA of ${requiredGPA.toFixed(
        2,
      )}. Your max achievable GPA is ${achievable.toFixed(
        2,
      )} with a score of A/A+ for every module. OR you could take a total of ${extraModules} 4MC (total ${extraModules * 4} MCs) graded modules scoring A/A+ in each.`;
    }

    return { required: requiredGPA, maxAchievable: achievable };
  }

  const handleTranscriptUpload = async (file: File | null) => {
    if (!file) {
      setTranscriptFile(null);
      setParseError("");
      return;
    }

    setTranscriptFile(file);
    setParseError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("transcript", file);

      const response = await fetch("/api/parse-transcript", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse transcript");
      }

      const parsed: ParsedTranscriptData = await response.json();

      setCurrentGPA(parsed.currentGPA);
      setCurrentUnits(parsed.totalGradedUnits);
      setParseError("");
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Failed to parse transcript",
      );
      setCurrentGPA(0);
      setCurrentUnits(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    const requiredGrade = calculateRequiredGPA(
      currentGPA,
      currentUnits,
      unitsLeft,
      desiredGPA,
    );
    setResult(requiredGrade);
  };

  return (
    <ComponentWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/icon.webp"
          width={xs ? 30 : 40}
          height={xs ? 30 : 40}
          style={{ borderRadius: 100 }}
          alt="icon"
        />
        <div style={{ width: 10 }}></div>
        <Text
          size="xl"
          style={{
            textAlign: "center",
            fontWeight: "bolder",
            fontSize: xs ? 20 : 24,
          }}
        >
          NUS GPA Simulator
        </Text>
      </div>

      <div>
        <Text
          fw="lighter"
          size="sm"
          style={{
            textAlign: "center",
            fontWeight: "bolder",
            fontSize: 16,
          }}
        >
          {data.simulatorInstructions}
        </Text>
        <br />
      </div>

      {/* Transcript Upload */}
      <FileInput
        label="Upload Transcript (Optional)"
        description="Upload your NUS transcript PDF to auto-fill GPA and units"
        placeholder="Choose transcript file"
        accept="application/pdf"
        value={transcriptFile}
        onChange={handleTranscriptUpload}
        mb="md"
        clearable
        disabled={isUploading}
      />

      {isUploading && (
        <Text size="sm" color="blue" mb="md">
          Parsing transcript...
        </Text>
      )}

      {parseError && (
        <Text size="sm" color="red" mb="md">
          {parseError}
        </Text>
      )}

      {/* Current GPA Input */}
      <NumberInput
        label="Current GPA"
        value={currentGPA}
        onChange={(e) => setCurrentGPA(Number(e))}
        min={0}
        max={5}
        step={0.01}
        decimalScale={2}
        mb="md"
      />

      {/* Current Units Input */}
      <NumberInput
        label="Current Units (only graded units, exclude CS/CU)"
        value={currentUnits}
        onChange={(e) => setCurrentUnits(Number(e))}
        min={0}
        mb="md"
      />

      {/* Desired GPA Input */}
      <NumberInput
        label="Desired GPA"
        value={desiredGPA}
        onChange={(e) => setDesiredGPA(Number(e))}
        min={0}
        max={5}
        step={0.01}
        decimalScale={2}
        mb="md"
      />

      {/* Units Left Input */}
      <NumberInput
        label="Planned units to take next semester / Current units this semester (exclude CS/CU)"
        value={unitsLeft}
        onChange={(e) => setUnitsLeft(Number(e))}
        min={0}
        mb="md"
      />

      {/* Submit Button */}
      <Button onClick={handleSubmit} fullWidth color="blue" mt="md">
        Calculate
      </Button>

      {/* Result Display */}
      {result && (
        <Group mt="lg" align="center">
          <Text size="lg">Required Grade for the Semester:</Text>
          {typeof result != "string" ? (
            <>
              <Text size="xl">{result.required.toFixed(2)} GPA</Text>||
              <Text size="xl">
                Max achievable GPA: {result.maxAchievable.toFixed(2)}
              </Text>
            </>
          ) : (
            <Text size="lg" color="red">
              {result}
            </Text>
          )}
        </Group>
      )}
    </ComponentWrapper>
  );
}
