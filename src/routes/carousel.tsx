import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/carousel")({
  component: CarouselPage,
});

function CarouselPage() {
  return <GeneratorPage engine={ENGINES["carousel"]!} />;
}
