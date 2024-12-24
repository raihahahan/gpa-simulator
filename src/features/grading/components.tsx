"use client";

import {
  TextInput,
  Select,
  NumberInput,
  Button,
  Table,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import { calculateGPA } from "./utils";
import Image from "next/image";
import ComponentWrapper from "@/common/wrapper";
import { data, GRADES } from "../../common/data";
import {
  IconBrandGithub,
  IconDownload,
  IconFileImport,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useGlobalMediaQuery } from "@/common/hooks";
import { useGrading } from "./hooks";

export default function GradingComponent() {
  const { xs, sm } = useGlobalMediaQuery();
  const {
    handleDelete,
    handleEdit,
    handleExport,
    handleImport,
    handleKeyPress,
    handleClear,
    modules,
    newModule,
    setNewModule,
    addOrUpdateModule,
    editingIndex,
    error,
  } = useGrading();

  const gpa = calculateGPA(modules);

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
          style={{
            textAlign: "center",
            fontWeight: "bolder",
            fontSize: xs ? 20 : 24,
          }}
        >
          {data.title}
        </Text>
      </div>
      <div style={{ marginTop: 15 }}></div>
      {data.instructions.map((instruction, index) => {
        return (
          <Text key={index} style={{ fontWeight: "lighter", fontSize: 14 }}>
            {`${index + 1}. ${instruction}`}
          </Text>
        );
      })}

      {/* Input Form */}
      <Group
        mb="lg"
        style={{
          flexDirection: sm ? "column" : "row",
          justifyContent: "center",
        }}
      >
        <TextInput
          label="Name"
          placeholder="e.g., CS1010"
          value={newModule.name}
          onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
          style={{ flex: 1, width: 200 }}
          onKeyDown={handleKeyPress}
        />
        <Select
          label="Grade"
          placeholder="Select grade"
          data={GRADES.map((g) => ({ value: g.grade, label: g.grade }))}
          value={newModule.grade}
          onChange={(value) =>
            setNewModule({ ...newModule, grade: value || "" })
          }
          style={{ width: 200 }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") addOrUpdateModule();
          }}
        />
        <NumberInput
          label="Credits"
          placeholder="e.g., 4"
          value={newModule.credits}
          onChange={(value) =>
            setNewModule({ ...newModule, credits: Number(value) || 4 })
          }
          min={0}
          style={{ width: 200 }}
          onKeyDown={handleKeyPress}
        />
        <Select
          label="S/U?"
          placeholder="Y/N"
          data={[
            { value: "y", label: "Yes" },
            { value: "n", label: "No" },
          ]}
          value={newModule.su ? "y" : "n"}
          onChange={(value) => setNewModule({ ...newModule, su: value == "y" })}
          min={0}
          style={{ width: 200 }}
          onKeyDown={handleKeyPress}
        />
        <Button
          leftSection={sm ? <IconPlus /> : null}
          onClick={addOrUpdateModule}
          color="green"
          style={{
            justifySelf: "center",
            marginTop: xs ? 0 : 20,
            width: sm ? 200 : undefined,
          }}
        >
          {editingIndex !== null ? "Update" : "Add"}
        </Button>
      </Group>

      {/* Modules Table */}
      {modules.length > 0 && (
        <Table highlightOnHover striped>
          <thead>
            <tr>
              <th>Module</th>
              <th>Grade</th>
              <th>Credits</th>
              <th>S/U?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{ alignSelf: "center" }}>
            {modules.map((module, index) => (
              <tr style={{ textAlign: "center" }} key={index}>
                <td>{module.name}</td>
                <td>{module.grade}</td>
                <td>{module.credits}</td>
                <td>{module.su ? "Yes" : "No"}</td>
                <td>
                  <Group style={{ justifyContent: "center" }}>
                    <Button
                      color="orange"
                      size="xs"
                      variant="filled"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* GPA Result */}
      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      )}
      <Text
        style={{ textAlign: "center", fontWeight: "bold" }}
        size="lg"
        mt="lg"
      >
        GPA: {gpa}
      </Text>

      {/* Import/Export Buttons */}
      <Group
        mt="lg"
        style={{
          alignSelf: "center",
          justifySelf: "center",
          alignItems: "center",
          flexDirection: xs ? "column" : "row",
        }}
      >
        <Button
          leftSection={<IconDownload />}
          color="cyan"
          onClick={handleExport}
        >
          Export
        </Button>
        <Button leftSection={<IconFileImport />} color="cyan" component="label">
          Import
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={handleImport}
          />
        </Button>
        <Button color={"red"} onClick={handleClear} leftSection={<IconTrash />}>
          Clear
        </Button>
        {xs ? (
          <Button color="dark" leftSection={<IconBrandGithub />}>
            GitHub
          </Button>
        ) : sm ? (
          <ActionIcon color="dark" size="lg">
            <IconBrandGithub />
          </ActionIcon>
        ) : (
          <Button color="dark" leftSection={<IconBrandGithub />}>
            Source Code
          </Button>
        )}
      </Group>
    </ComponentWrapper>
  );
}

export const GradeTable = () => {
  return (
    <ComponentWrapper>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Letter Grade</Table.Th>
            <Table.Th>Grade Point</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {GRADES.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>{item.grade}</Table.Td>
              <Table.Td>{item.points.toFixed(2)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ComponentWrapper>
  );
};
