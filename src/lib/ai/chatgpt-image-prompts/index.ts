/**
 * ============================================================================
 * CHATGPT IMAGE PROMPTS — Central Dispatcher Index
 *
 * Exports one main function: buildChatGPTImagePrompt()
 * Maps each engine ID → its specialized ultra-long prompt builder.
 *
 * Every engine produces a DIFFERENT and UNIQUE prompt structure.
 * No two engines share the same rules, composition architecture, or
 * negative constraint lists.
 *
 * Usage:
 *   import { buildChatGPTImagePrompt } from "@/lib/ai/chatgpt-image-prompts";
 *   const prompt = buildChatGPTImagePrompt(engineId, result, brief, slideIndex);
 * ============================================================================
 */

import type { AiResult } from "@/components/studio/PromptResult";

import { buildDesignGrafisChagptPrompt } from "./design-grafis.chatgpt";
import {
  buildGrid9SlideChagptPrompt,
  buildGrid9AllSlidesChagptPrompts,
} from "./grid-9.chatgpt";
import {
  buildCarouselSlideChagptPrompt,
  buildCarouselAllSlidesChagptPrompts,
} from "./carousel.chatgpt";
import { buildStoriesChagptPrompt } from "./stories.chatgpt";
import { buildFeedPortraitChagptPrompt } from "./feed-portrait.chatgpt";
import { buildFeedSquareChagptPrompt } from "./feed-square.chatgpt";
import { buildMenuFnbChagptPrompt } from "./menu-fnb.chatgpt";
import { buildTryOnProdukChagptPrompt } from "./try-on-produk.chatgpt";
import { buildLogoProdukChagptPrompt } from "./logo-produk.chatgpt";
import { buildYoutubeThumbnailChagptPrompt } from "./youtube-thumbnail.chatgpt";
import { buildTypographyAdsChagptPrompt } from "./typography-ads.chatgpt";
import { buildReviewProdukChagptPrompt } from "./review-produk.chatgpt";
import { buildVideoStoryboardChagptPrompt } from "./video-storyboard.chatgpt";
import { buildAdsChagptPrompt } from "./ads.chatgpt";

export type { AiResult };

/**
 * Builds an ultra-long ChatGPT Images / DALL-E 3 prompt for a specific slide.
 *
 * @param engineId   - The engine key (e.g., "design_grafis", "grid_9", "carousel")
 * @param result     - The AI result JSON from generate-prompt endpoint
 * @param brief      - Key-value map of the user's form fields
 * @param slideIndex - 0-based slide index (for multi-slide engines like grid_9, carousel)
 * @returns Ultra-long prompt string ready to paste into ChatGPT Images
 */
export function buildChatGPTImagePrompt(
  engineId: string,
  result: AiResult,
  brief: Record<string, string>,
  slideIndex = 0,
): string {
  // Normalize engine key
  const engine = engineId.toLowerCase().replace(/-/g, "_");

  switch (engine) {
    // ── M1 — Design Grafis & Commercial Ads ──────────────────────────────────
    case "design_grafis":
      return buildDesignGrafisChagptPrompt(result, brief);

    // ── M2 — 9 Feed Konsisten / Connected Grid ────────────────────────────────
    case "grid_9":
      return buildGrid9SlideChagptPrompt(slideIndex, result, brief);

    // ── M3 — Carousel Feeds ───────────────────────────────────────────────────
    case "carousel": {
      const totalSlides = (result.slides ?? []).length || 5;
      return buildCarouselSlideChagptPrompt(slideIndex, totalSlides, result, brief);
    }

    // ── M4 — YouTube Thumbnail ────────────────────────────────────────────────
    case "youtube_thumbnail":
      return buildYoutubeThumbnailChagptPrompt(result, brief);

    // ── M5 — Typography Ads ───────────────────────────────────────────────────
    case "typography_ads":
      return buildTypographyAdsChagptPrompt(result, brief);

    // ── M8 — Menu F&B ─────────────────────────────────────────────────────────
    case "menu_fnb":
      return buildMenuFnbChagptPrompt(result, brief);

    // ── M9 — Logo Produk ──────────────────────────────────────────────────────
    case "logo_produk":
      return buildLogoProdukChagptPrompt(result, brief);

    // ── M10 — Try-On Produk ───────────────────────────────────────────────────
    case "try_on_produk":
      return buildTryOnProdukChagptPrompt(result, brief);

    // ── M11 — Review Produk ───────────────────────────────────────────────────
    case "review_produk":
      return buildReviewProdukChagptPrompt(result, brief);

    // ── M12 — Video Storyboard ────────────────────────────────────────────────
    case "video_storyboard":
      return buildVideoStoryboardChagptPrompt(result, brief, slideIndex);

    // ── Legacy Aliases ────────────────────────────────────────────────────────
    case "stories":
      return buildStoriesChagptPrompt(result, brief, slideIndex);

    case "feed_portrait":
      return buildFeedPortraitChagptPrompt(result, brief);

    case "feed_square":
      return buildFeedSquareChagptPrompt(result, brief);

    case "ads":
      return buildAdsChagptPrompt(result, brief);

    // ── Fallback: Unknown engine ──────────────────────────────────────────────
    default:
      // Attempt best-match fallback for unknown engines
      return buildDesignGrafisChagptPrompt(result, brief);
  }
}

/**
 * Builds prompts for ALL slides of a multi-slide engine.
 * Returns an array of prompt strings (one per slide).
 * For single-slide engines, returns an array with one element.
 *
 * @param engineId - The engine key
 * @param result   - The AI result JSON
 * @param brief    - User's form values
 */
export function buildAllSlidesChagptPrompts(
  engineId: string,
  result: AiResult,
  brief: Record<string, string>,
): string[] {
  const engine = engineId.toLowerCase().replace(/-/g, "_");

  switch (engine) {
    case "grid_9":
      return buildGrid9AllSlidesChagptPrompts(result, brief);

    case "carousel":
      return buildCarouselAllSlidesChagptPrompts(result, brief);

    case "design_grafis": {
      const slides = result.slides ?? [];
      if (slides.length > 1) {
        return slides.map((_, i) => buildDesignGrafisChagptPrompt(result, brief, i));
      }
      return [buildDesignGrafisChagptPrompt(result, brief, 0)];
    }

    case "video_storyboard": {
      const count = (result.slides ?? []).length || 4;
      return Array.from({ length: count }, (_, i) =>
        buildVideoStoryboardChagptPrompt(result, brief, i),
      );
    }

    case "stories": {
      const count = (result.slides ?? []).length || 1;
      return Array.from({ length: count }, (_, i) =>
        buildStoriesChagptPrompt(result, brief, i),
      );
    }

    default:
      // Single-slide engines
      return [buildChatGPTImagePrompt(engineId, result, brief, 0)];
  }
}

// Re-export individual builders for granular access if needed
export {
  buildDesignGrafisChagptPrompt,
  buildGrid9SlideChagptPrompt,
  buildGrid9AllSlidesChagptPrompts,
  buildCarouselSlideChagptPrompt,
  buildCarouselAllSlidesChagptPrompts,
  buildStoriesChagptPrompt,
  buildFeedPortraitChagptPrompt,
  buildFeedSquareChagptPrompt,
  buildMenuFnbChagptPrompt,
  buildTryOnProdukChagptPrompt,
  buildLogoProdukChagptPrompt,
  buildYoutubeThumbnailChagptPrompt,
  buildTypographyAdsChagptPrompt,
  buildReviewProdukChagptPrompt,
  buildVideoStoryboardChagptPrompt,
  buildAdsChagptPrompt,
};
