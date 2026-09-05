import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/copy-writing")({
  component: CopyWritingPage,
});

function CopyWritingPage() {
  return <GeneratorPage engine={ENGINES["copy_writing"]!} />;
}
