import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/menu-fnb")({
  component: MenuFnbPage,
});

function MenuFnbPage() {
  return <GeneratorPage engine={ENGINES["menu_fnb"]!} />;
}
