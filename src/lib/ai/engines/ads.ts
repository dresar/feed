import type { BriefPayload } from "../prompt-builder.server";
import { buildDesignGrafisPrompt } from "./design-grafis";

export function buildAdsPrompt(payload: BriefPayload) {
  // Directly utilize the commercial direct response banner engine
  return buildDesignGrafisPrompt(payload);
}
