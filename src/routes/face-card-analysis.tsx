import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/face-card-analysis")({
  component: FaceCardAnalysisPage,
});

function FaceCardAnalysisPage() {
  return <GeneratorPage engine={ENGINES["face_card_analysis"]!} />;
}
