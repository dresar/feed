import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/video-storyboard")({
  component: VideoStoryboardPage,
});

function VideoStoryboardPage() {
  return <GeneratorPage engine={ENGINES["video_storyboard"]!} />;
}
