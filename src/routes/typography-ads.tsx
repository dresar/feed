import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/typography-ads")({
  component: TypographyAdsPage,
});

function TypographyAdsPage() {
  return <GeneratorPage engine={ENGINES["typography_ads"]!} />;
}
