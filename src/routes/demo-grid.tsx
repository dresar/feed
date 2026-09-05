import { createFileRoute } from "@tanstack/react-router";
import { InstagramGridSimulator } from "@/components/studio/InstagramGridSimulator";

export const Route = createFileRoute("/demo-grid")({
  component: DemoGridPage,
  head: () => ({
    meta: [
      {
        title: "Simulator Grid Instagram 2026 — Preview & Uji Sambungan 9 Feed",
      },
      {
        name: "description",
        content:
          "Simulator Grid Instagram 2026. Uji tata letak 3x3 profile puzzle, aspect ratio 1:1 dan 4:5, auto-splitter, dan urutan posting tanpa simpan ke CDN (100% Chrome Local Storage).",
      },
    ],
  }),
});

function DemoGridPage() {
  return <InstagramGridSimulator />;
}
