import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Palette,
  Sparkles,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Type,
  Camera,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  loadBrandKit,
  saveBrandKit,
  clearBrandKit,
  EMPTY_BRAND_KIT,
  type BrandKit,
} from "@/lib/storage";

export const Route = createFileRoute("/brand-kit")({
  component: BrandKitPage,
});

function BrandKitPage() {
  const [kit, setKit] = useState<BrandKit>(EMPTY_BRAND_KIT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = loadBrandKit();
    if (existing) {
      setKit(existing);
    }
  }, []);

  const updateField = (key: keyof BrandKit, value: string | boolean) => {
    setKit((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveBrandKit(kit);
    setSaved(true);
    toast.success("Brand Kit saved! It will be automatically injected into AI prompts.");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    clearBrandKit();
    setKit(EMPTY_BRAND_KIT);
    toast.info("Brand Kit reset to defaults.");
  };

  const loadSampleBrand = () => {
    setKit({
      brand: "Luminary Botanical",
      description: "Organic clinical-grade skincare designed for modern tropical lifestyles.",
      industry: "Clean Beauty & Wellness",
      audience: "Urban professionals aged 24-38 seeking minimalist high-performance skincare.",
      personality: "Serene, elevated, scientific yet organic, mindful luxury.",
      primary_color: "#E25822",
      secondary_color: "#1E2A22",
      accent_color: "#F4EDE2",
      typography: "Modern grotesk with high-contrast serif accents",
      visual_style: "Minimal warm Scandinavian minimalism, soft earthy gradient shadows",
      photography_style:
        "Crisp macro product shots with dew droplets and architectural stone pedestals",
      lighting_style: "Soft morning daylight with delicate organic tree leaf shadows",
      background_style: "Textured lime plaster wall in warm bone white",
      positioning: "The intersection of botanical purity and dermatologist science.",
      words_to_use: "Glow, Botanical, Radiant, Pure, Ritual, Elevate, Conscious",
      words_to_avoid: "Cheap, Quick fix, Miracle, Chemical, Artificial",
      cta_language: "Discover the Ritual • Shop the Collection",
      visual_references: "Aesop, Glossier, Kinfolk aesthetic",
      active: true,
    });
    toast.success("Loaded sample brand kit!");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mono-label">Instagram Studio / Brand DNA</div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              Brand Kit
            </h1>
            <span className="rounded-full border border-border-strong bg-accent/30 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-foreground">
              DNA
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure your brand identity once. The AI will automatically inject your palette,
            voice, and visual style into every generated prompt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadSampleBrand}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            Load Sample
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
          >
            {saved ? <CheckCircle2 className="size-3.5" /> : <Save className="size-3.5" />}
            {saved ? "Saved" : "Save Brand Kit"}
          </button>
        </div>
      </div>

      {/* Active Toggle Banner */}
      <div className="panel mb-6 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border-strong bg-accent/30">
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Active Brand Injection</div>
            <div className="text-xs text-muted-foreground">
              When active, these brand constraints automatically steer all creative modes.
            </div>
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={kit.active}
            onChange={(e) => updateField("active", e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-surface-2 peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Section 1: Core Identity */}
        <div className="panel space-y-4 p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sliders className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">1. Core Brand Identity</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Brand Name *
              </label>
              <input
                type="text"
                value={kit.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="e.g. AuraSkin Lab"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Industry & Category
              </label>
              <input
                type="text"
                value={kit.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                placeholder="e.g. Clean Beauty, Organic Skincare"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Brand Description
              </label>
              <textarea
                rows={2}
                value={kit.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="What does your brand stand for?"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Target Audience
              </label>
              <input
                type="text"
                value={kit.audience}
                onChange={(e) => updateField("audience", e.target.value)}
                placeholder="e.g. Tech founders, skincare enthusiasts aged 25-35"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Brand Personality & Mood
              </label>
              <input
                type="text"
                value={kit.personality}
                onChange={(e) => updateField("personality", e.target.value)}
                placeholder="e.g. Bold, minimal, scientific, welcoming"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Color Palette */}
        <div className="panel space-y-4 p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Palette className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">2. Color Palette</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={kit.primary_color || "#FF4F55"}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  className="size-8 cursor-pointer rounded-lg border border-border bg-transparent p-0"
                />
                <input
                  type="text"
                  value={kit.primary_color}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  placeholder="#FF4F55"
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={kit.secondary_color || "#651017"}
                  onChange={(e) => updateField("secondary_color", e.target.value)}
                  className="size-8 cursor-pointer rounded-lg border border-border bg-transparent p-0"
                />
                <input
                  type="text"
                  value={kit.secondary_color}
                  onChange={(e) => updateField("secondary_color", e.target.value)}
                  placeholder="#651017"
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Accent / Background Tone
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={kit.accent_color || "#FFF3F3"}
                  onChange={(e) => updateField("accent_color", e.target.value)}
                  className="size-8 cursor-pointer rounded-lg border border-border bg-transparent p-0"
                />
                <input
                  type="text"
                  value={kit.accent_color}
                  onChange={(e) => updateField("accent_color", e.target.value)}
                  placeholder="#FFF3F3"
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
                />
              </div>
            </div>

            {/* Live Palette Preview */}
            <div className="mt-4 rounded-lg border border-border bg-surface p-3">
              <div className="mono-label mb-2">Palette Preview</div>
              <div className="flex h-12 overflow-hidden rounded-md border border-border">
                <div
                  className="flex flex-1 items-center justify-center font-mono text-[10px] font-bold text-white shadow-inner"
                  style={{ backgroundColor: kit.primary_color || "#FF4F55" }}
                >
                  Primary
                </div>
                <div
                  className="flex flex-1 items-center justify-center font-mono text-[10px] font-bold text-white shadow-inner"
                  style={{ backgroundColor: kit.secondary_color || "#651017" }}
                >
                  Secondary
                </div>
                <div
                  className="flex flex-1 items-center justify-center font-mono text-[10px] font-bold text-black shadow-inner"
                  style={{ backgroundColor: kit.accent_color || "#FFF3F3" }}
                >
                  Accent
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Visual & Photography Style */}
        <div className="panel space-y-4 p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Camera className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              3. Visual & Photography Direction
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Overall Visual Style
              </label>
              <input
                type="text"
                value={kit.visual_style}
                onChange={(e) => updateField("visual_style", e.target.value)}
                placeholder="e.g. Warm Scandinavian minimalism, clean product studio"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Photography & Lighting
              </label>
              <input
                type="text"
                value={kit.lighting_style}
                onChange={(e) => updateField("lighting_style", e.target.value)}
                placeholder="e.g. Soft morning daylight with gentle sunbeam shadows"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Preferred Backgrounds
              </label>
              <input
                type="text"
                value={kit.background_style}
                onChange={(e) => updateField("background_style", e.target.value)}
                placeholder="e.g. Architectural stone, neutral bone white podium"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Visual References & Influences
              </label>
              <input
                type="text"
                value={kit.visual_references}
                onChange={(e) => updateField("visual_references", e.target.value)}
                placeholder="e.g. Apple minimalism, Aesop skincare, Kinfolk"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Typography & Tone */}
        <div className="panel space-y-4 p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Type className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">4. Typography & Voice</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Typography Preference
              </label>
              <input
                type="text"
                value={kit.typography}
                onChange={(e) => updateField("typography", e.target.value)}
                placeholder="e.g. Modern geometric sans-serif with bold headlines"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Words / Keywords to Use
              </label>
              <input
                type="text"
                value={kit.words_to_use}
                onChange={(e) => updateField("words_to_use", e.target.value)}
                placeholder="e.g. Elevate, Radiant, Minimal, Science, Ritual"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Words to Avoid
              </label>
              <input
                type="text"
                value={kit.words_to_avoid}
                onChange={(e) => updateField("words_to_avoid", e.target.value)}
                placeholder="e.g. Cheap, Cheap discount, Miracle, Chemical"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Preferred Call to Action (CTA) Style
              </label>
              <input
                type="text"
                value={kit.cta_language}
                onChange={(e) => updateField("cta_language", e.target.value)}
                placeholder="e.g. Shop Now • Learn More • Link in Bio"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
