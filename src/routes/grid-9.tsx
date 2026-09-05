import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/grid-9")({
  component: Grid9Page,
});

function Grid9Page() {
  return <GeneratorPage engine={ENGINES["grid_9"]!} />;
}
