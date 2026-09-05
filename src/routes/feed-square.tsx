import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/feed-square")({
  component: FeedSquarePage,
});

function FeedSquarePage() {
  return <GeneratorPage engine={ENGINES["feed_square"]!} />;
}
