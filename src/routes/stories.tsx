import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/stories")({
  component: StoriesPage,
});

function StoriesPage() {
  return <GeneratorPage engine={ENGINES["stories"]!} />;
}
