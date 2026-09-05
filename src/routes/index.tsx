import { createFileRoute } from "@tanstack/react-router";
import {
  PublicNavbar,
  HeroSection,
  EngineShowcase,
  PresetCarousel,
  FeatureHighlights,
  PricingSection,
  PublicFooter,
} from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "InstaPrompt Forge — AI Studio Generator Prompt Instagram & Ads Komersial #1",
      },
      {
        name: "description",
        content:
          "Platform AI Studio #1 di Indonesia untuk meracik prompt visual iklan Instagram komersial, carousel feeds, stories 9:16, foto produk, dan video storyboard dengan kualitas DALL-E 3 dan Midjourney v6.",
      },
      { property: "og:title", content: "InstaPrompt Forge — Studio AI Generator Prompt Instagram & Ads" },
      {
        property: "og:description",
        content:
          "12 Creative Engines untuk meracik prompt visual iklan Instagram, Carousel, Stories, dan Feed level Midjourney v6 & DALL-E 3.",
      },
      { property: "og:url", content: "https://feedai.my.id/" },
      { name: "twitter:title", content: "InstaPrompt Forge — AI Studio Generator Prompt Instagram & Ads" },
    ],
  }),
  component: LandingPage,
});

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 scroll-smooth">
      {/* 1. Sticky Public Header & Auth Controls */}
      <PublicNavbar />

      {/* 2. Main Page Content Stream */}
      <main className="flex-1">
        {/* Hero Banner with Value Proposition & Interactive Prompt Sandbox Demo */}
        <HeroSection />

        {/* 12 AI Commercial Engines Grid */}
        <EngineShowcase />

        {/* 40 Visual Style Presets Showcase & Interactive Inspector */}
        <PresetCarousel />

        {/* Core Technological Advantages & Bento Grid */}
        <FeatureHighlights />

        {/* Transparent Pricing Packages & FAQ Accordion */}
        <PricingSection />
      </main>

      {/* 3. Comprehensive SaaS Dark Footer */}
      <PublicFooter />
    </div>
  );
}
