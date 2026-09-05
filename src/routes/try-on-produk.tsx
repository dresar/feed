import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/try-on-produk")({
  component: TryOnProdukPage,
});

function TryOnProdukPage() {
  return <GeneratorPage engine={ENGINES["try_on_produk"]!} />;
}
