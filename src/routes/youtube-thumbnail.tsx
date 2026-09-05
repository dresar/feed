import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/youtube-thumbnail")({
  component: YoutubeThumbnailPage,
});

function YoutubeThumbnailPage() {
  return <GeneratorPage engine={ENGINES["youtube_thumbnail"]!} />;
}
