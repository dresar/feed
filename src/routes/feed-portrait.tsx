import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/feed-portrait")({
  component: FeedPortraitPage,
});

function FeedPortraitPage() {
  return <GeneratorPage engine={ENGINES["feed_portrait"]!} />;
}
