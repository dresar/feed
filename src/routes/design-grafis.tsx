import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/design-grafis")({
  component: DesignGrafisPage,
});

function DesignGrafisPage() {
  return <GeneratorPage engine={ENGINES["design_grafis"]!} />;
}
