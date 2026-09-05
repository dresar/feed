import { buildDesignGrafisPrompt } from "./engines/design-grafis";
import { buildGrid9Prompt } from "./engines/grid-9";
import { buildCarouselPrompt } from "./engines/carousel";
import { buildStoriesPrompt } from "./engines/stories";
import { buildFeedPortraitPrompt } from "./engines/feed-portrait";
import { buildFeedSquarePrompt } from "./engines/feed-square";
import { buildYoutubeThumbnailPrompt } from "./engines/youtube-thumbnail";
import { buildTypographyAdsPrompt } from "./engines/typography-ads";
import { buildCopyWritingPrompt } from "./engines/copy-writing";
import { buildFaceCardAnalysisPrompt } from "./engines/face-card-analysis";
import { buildMenuFnbPrompt } from "./engines/menu-fnb";
import { buildLogoProdukPrompt } from "./engines/logo-produk";
import { buildTryOnProdukPrompt } from "./engines/try-on-produk";
import { buildReviewProdukPrompt } from "./engines/review-produk";
import { buildVideoStoryboardPrompt } from "./engines/video-storyboard";
import { buildAdsPrompt } from "./engines/ads";

export interface BriefPayload {
  mode: string;
  brandKit?: Record<string, string> | null | undefined;
  imagekit_url?: string | undefined;
  [key: string]: unknown;
}

export function buildMessages(payload: BriefPayload): Array<{ role: "system" | "user"; content: string }> {
  const mode = payload.mode;

  switch (mode) {
    case "design_grafis":
      return buildDesignGrafisPrompt(payload);
    case "grid_9":
      return buildGrid9Prompt(payload);
    case "carousel":
      return buildCarouselPrompt(payload);
    case "stories":
      return buildStoriesPrompt(payload);
    case "feed_portrait":
      return buildFeedPortraitPrompt(payload);
    case "feed_square":
      return buildFeedSquarePrompt(payload);
    case "youtube_thumbnail":
      return buildYoutubeThumbnailPrompt(payload);
    case "typography_ads":
      return buildTypographyAdsPrompt(payload);
    case "copy_writing":
    case "caption_hook":
    case "captions":
      return buildCopyWritingPrompt(payload);
    case "face_card_analysis":
      return buildFaceCardAnalysisPrompt(payload);
    case "menu_fnb":
      return buildMenuFnbPrompt(payload);
    case "logo_produk":
      return buildLogoProdukPrompt(payload);
    case "try_on_produk":
      return buildTryOnProdukPrompt(payload);
    case "review_produk":
      return buildReviewProdukPrompt(payload);
    case "video_storyboard":
      return buildVideoStoryboardPrompt(payload);
    case "ads":
      return buildAdsPrompt(payload);
    default:
      return buildDesignGrafisPrompt(payload);
  }
}

export function parseAiJson(raw: string): any {
  if (!raw) return null;
  const cleaned = raw
    .replace(/^```(?:json)?/gm, "")
    .replace(/```$/gm, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        // Try fixing trailing commas or unescaped characters
      }
    }
    return null;
  }
}
