import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/ads")({
  component: AdsPage,
});

function AdsPage() {
  return <GeneratorPage engine={ENGINES["product_ads"]!} />;
}
