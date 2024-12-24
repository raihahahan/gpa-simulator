import { Container, Paper } from "@mantine/core";

export default function ComponentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="md" mt="xl">
      <Paper shadow="xs" p="lg" withBorder>
        {children}
      </Paper>
    </Container>
  );
}
