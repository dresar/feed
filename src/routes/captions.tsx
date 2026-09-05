import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/captions")({
  component: CaptionsPage,
});

function CaptionsPage() {
  return <GeneratorPage engine={ENGINES["caption_hook"]!} />;
}
