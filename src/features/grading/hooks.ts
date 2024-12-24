import { useState } from "react";
import { Module } from "./types";
import { GRADES } from "../../common/data";

export function useGrading() {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState<Omit<Module, "points">>({
    name: "",
    grade: "",
    credits: 4,
    su: false,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const addOrUpdateModule = (): void => {
    setError("");
    if (newModule.name && newModule.grade && newModule.credits > 0) {
      const gradeData = GRADES.find((g) => g.grade === newModule.grade);
      if (editingIndex !== null) {
        const updatedModules = [...modules];
        updatedModules[editingIndex] = {
          ...newModule,
          name: newModule.name.toUpperCase().trim(),
          points: gradeData ? gradeData.points : 0,
        };
        setModules(updatedModules);
        setEditingIndex(null);
      } else {
        if (
          modules.find(
            (m) => m.name.toUpperCase() == newModule.name.toUpperCase()
          )
        ) {
          setError(
            `Module ${newModule.name.toUpperCase().trim()} is already added.`
          );
          return;
        }
        setModules([
          ...modules,
          {
            ...newModule,
            name: newModule.name.toUpperCase(),
            points: gradeData ? gradeData.points : 0,
          },
        ]);
      }
      setNewModule({ name: "", grade: "A+", credits: 4, su: false });
    } else {
      setError("Please fill in all required input.");
    }
  };

  const handleEdit = (index: number): void => {
    const moduleToEdit = modules[index];
    setNewModule({
      name: moduleToEdit.name,
      grade: moduleToEdit.grade,
      credits: moduleToEdit.credits,
      su: moduleToEdit.su,
    });
    setEditingIndex(index);
  };

  const handleExport = (): void => {
    const dataStr = JSON.stringify(modules, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "modules.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (
            Array.isArray(data) &&
            data.every(
              (item) => "name" in item && "grade" in item && "credits" in item
            )
          ) {
            setModules(data);
          } else {
            alert("Invalid file format.");
          }
        } catch {
          alert("Failed to parse the file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = (index: number): void => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      addOrUpdateModule();
    }
  };

  const handleClear = () => {
    const p = confirm("Are you sure?");
    if (p) {
      setModules([]);
    }
  };

  return {
    handleEdit,
    handleExport,
    handleImport,
    handleDelete,
    handleKeyPress,
    handleClear,
    modules,
    newModule,
    setNewModule,
    addOrUpdateModule,
    editingIndex,
    error,
  };
}
