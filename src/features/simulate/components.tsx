"use client";
import { useState } from "react";
import { NumberInput, Button, Text, Group } from "@mantine/core";
import ComponentWrapper from "@/common/wrapper";
import { useGlobalMediaQuery } from "@/common/hooks";
import { GRADES } from "@/common/data";

export default function GradeSimulator() {
  const [currentGPA, setCurrentGPA] = useState<number>(0);
  const [currentUnits, setCurrentUnits] = useState<number>(0);
  const [desiredGPA, setDesiredGPA] = useState<number>(0);
  const [unitsLeft, setUnitsLeft] = useState<number>(0);
  const [result, setResult] = useState<string | number>(""); // To store the result of the calculation
  const { xs } = useGlobalMediaQuery();

  function calculateRequiredGPA(
    currentGPA: number,
    completedUnits: number,
    plannedUnits: number,
    desiredGPA: number
  ): number | string {
    if (plannedUnits <= 0) {
      return "Invalid units left"; // Ensure units left is positive
    }

    console.log(currentGPA, completedUnits, plannedUnits, desiredGPA);
    const totalPointsRequired = desiredGPA * (completedUnits + plannedUnits);
    const currPoints = currentGPA * completedUnits;
    const requiredPoints = totalPointsRequired - currPoints;
    const requiredGPA = requiredPoints / plannedUnits;

    if (requiredGPA > GRADES[0].points) {
      const maxRequiredPoints = GRADES[0].points * plannedUnits;
      const maxTotalPointsRequired = maxRequiredPoints + currPoints;
      const achievable =
        maxTotalPointsRequired / (completedUnits + plannedUnits);

      return `Your desired GPA is too high as you will need a GPA of ${requiredGPA}. Your max achievable GPA is ${achievable.toFixed(
        2
      )} with a score of A/A+ for every module.`;
    }

    return requiredGPA;
  }

  const handleSubmit = () => {
    const requiredGrade = calculateRequiredGPA(
      currentGPA,
      currentUnits,
      unitsLeft,
      desiredGPA
    );
    setResult(requiredGrade);
  };

  return (
    <ComponentWrapper>
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

      {/* Current GPA Input */}
      <NumberInput
        label="Current GPA"
        value={currentGPA}
        onChange={(e) => setCurrentGPA(Number(e))}
        min={0}
        max={5}
        mb="md"
      />

      {/* Current Units Input */}
      <NumberInput
        label="Current Units"
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
        mb="md"
      />

      {/* Units Left Input */}
      <NumberInput
        label="Units Left"
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
      <Group mt="lg" align="center">
        <Text size="lg">Required Grade per Module: </Text>
        {typeof result === "number" ? (
          <Text size="xl">{result.toFixed(2)} GPA</Text>
        ) : (
          <Text size="lg" color="red">
            {result}
          </Text>
        )}
      </Group>
    </ComponentWrapper>
  );
}
