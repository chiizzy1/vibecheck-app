import { type TakeMetrics, type CaptionResult } from "../types/session";

interface CaptionRequest {
  transcript: string; // The speech-to-text transcript of the video
  metrics: TakeMetrics;
  aesthetic: string; // e.g., "minimalist", "hype", "educational"
  platform: "tiktok" | "reels" | "shorts";
}

class CaptionEngine {
  private readonly TRENDING_TAGS_CACHE: Record<string, string[]> = {
    tiktok: ["#fyp", "#foryou", "#creator", "#vibecheck", "#viral"],
    reels: ["#explorepage", "#reelsinstagram", "#creators", "#vibecheck"],
    shorts: ["#shorts", "#youtube", "#creator", "#vibecheck", "#subscribe"],
  };

  /**
   * Mocks a call to the Gemini API to generate smart captions.
   * In production, this would hit a Supabase Edge Function that securely
   * communicates with Gemini, passing carefully crafted prompts.
   */
  async generateCaptions(request: CaptionRequest): Promise<CaptionResult> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // MOCK IMPLEMENTATION based on the aesthetic and platform requested
    const defaultTags = this.TRENDING_TAGS_CACHE[request.platform].join(" ");

    // Generate 3 distinct variants leveraging the transcript and metrics
    const variants = [
      this.generateVariantA(request.transcript, request.aesthetic),
      this.generateVariantB(request.transcript, request.aesthetic),
      this.generateVariantC(request.transcript, request.aesthetic),
    ];

    // Select the first variant as the default primary caption
    const primaryCaption = variants[0];

    return {
      caption: primaryCaption,
      hashtags: defaultTags,
      aesthetic: request.aesthetic,
      platform: request.platform,
      variants,
    };
  }

  private generateVariantA(transcript: string, aesthetic: string): string {
    if (aesthetic === "hype") return `POV: When you finally realize the secret 🤯🔥 Drop a ⚡ if you agree!`;
    if (aesthetic === "educational")
      return `The #1 mistake creators make (and how I fixed it). 📝 Keep watching for the breakdown!`;
    return `Just keeping it real with you guys today 🤍 Thoughts?`;
  }

  private generateVariantB(transcript: string, aesthetic: string): string {
    if (aesthetic === "hype") return `This is your sign to STOP scrolling and listen up 🛑📈 Let's go!`;
    if (aesthetic === "educational") return `Part 1 | Want to boost your engagement? It all comes down to eye contact. 👀👇`;
    return `A little behind the scenes action for you... 🎬✨ Let me know what you think in the comments!`;
  }

  private generateVariantC(transcript: string, aesthetic: string): string {
    if (aesthetic === "hype") return `Wait for the end... I promise it's worth it 😉🏆 Rate this take 1-10!`;
    if (aesthetic === "educational") return `Save this for later! 📌 Here is the exact strategy I use to hook an audience...`;
    return `Can we talk about this for a second? 🗣️ I need your opinions on this down below 👇`;
  }
}

export const captionEngine = new CaptionEngine();
