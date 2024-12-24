import GradingComponent, { GradeTable } from "@/features/grading/components";
import GradeSimulator from "@/features/simulate/components";

export default function Home() {
  return (
    <div>
      <GradingComponent />
      <GradeSimulator />
      <GradeTable />
    </div>
  );
}
