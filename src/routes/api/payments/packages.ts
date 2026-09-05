import { createFileRoute } from "@tanstack/react-router";
import { getDbPricingPackages, getDbPromoBanner } from "@/lib/db.server";
import { json } from "@/lib/auth.server";

export const Route = createFileRoute("/api/payments/packages")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [packages, promoBanner] = await Promise.all([
            getDbPricingPackages(),
            getDbPromoBanner(),
          ]);

          return json({
            success: true,
            packages,
            promoBanner,
          });
        } catch (err: any) {
          return json(
            {
              success: false,
              error: err.message || "Gagal memuat paket harga.",
            },
            500
          );
        }
      },
    },
  },
});
