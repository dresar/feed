import { createFileRoute } from "@tanstack/react-router";
import { ENGINES } from "@/lib/engines";
import { GeneratorPage } from "@/components/studio/GeneratorPage";

export const Route = createFileRoute("/review-produk")({
  component: ReviewProdukPage,
});

function ReviewProdukPage() {
  return <GeneratorPage engine={ENGINES["review_produk"]!} />;
}
