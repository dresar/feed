import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/logo-produk")({
  component: LogoProdukPage,
});

function LogoProdukPage() {
  return <GeneratorPage engine={ENGINES["logo_produk"]!} />;
}
