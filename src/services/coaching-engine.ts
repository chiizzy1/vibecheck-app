import { useSessionStore } from "../stores/session-store";
import { useUserStore } from "../stores/user-store";
import { type LiveMetrics, type CoachingMessage } from "../types/session";
import { geminiClient } from "./gemini-client";

/**
 * Orchestrates coaching feedback.
 * - Free Tier Users: Assesses metrics locally and triggers rule-based templates.
 * - Pro Tier Users: Pipes metrics and triggers to Gemini Live API via WebSocket.
 */
export class CoachingEngine {
  private isRunning = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastMessageTime = 0;
  private readonly COOLDOWN_MS = 6000; // Don't spam the user — wait 6s between messages

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const isPro = useUserStore.getState().isPro();
    const mode = useSessionStore.getState().session?.mode || "director";

    if (isPro) {
      // PRO: Connect WebSocket to Gemini and start sending frames + context
      geminiClient.connect(mode);

      // We evaluate sending context to Gemini every second
      this.intervalId = setInterval(() => this.evaluateGeminiPro(), 1000);
    } else {
      // FREE: Use on-device rule engine
      this.intervalId = setInterval(() => this.evaluateRuleBasedFree(), 1000);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) clearInterval(this.intervalId);

    if (useUserStore.getState().isPro()) {
      geminiClient.disconnect();
    }
  }

  // --- Pro Tier: Gemini Pipeline ---

  private evaluateGeminiPro() {
    const state = useSessionStore.getState();
    if (!state.isRecording) return; // Only actively coach while recording

    // Send the current baseline metrics to Gemini quietly
    // so it has context on the numbers behind the frame.
    // e.g. {"eyeContact": 45, "energy": 3}
    const metricsSummary = `Live Metrics: Eye Contact ${state.liveMetrics.eyeContactPct}%, Energy ${state.liveMetrics.energyScore}/10, Smiles ${state.liveMetrics.smileCount}.`;

    // We don't trigger a forced generation here, we just send client content context.
    // However, if metrics dip low enough, we actively prompt Gemini to speak.
    if (state.liveMetrics.eyeContactPct < 50 && Date.now() - this.lastMessageTime > this.COOLDOWN_MS) {
      geminiClient.sendContext(
        `${metricsSummary} The user just lost eye contact. Give them a quick 1-sentence correction based on your personality mode.`,
      );
      this.lastMessageTime = Date.now();
    }
  }

  // --- Free Tier: Rule-based Templates ---

  private evaluateRuleBasedFree() {
    const state = useSessionStore.getState();
    const mode = state.session?.mode || "director";
    const metrics: LiveMetrics = state.liveMetrics;

    if (!state.isRecording || Date.now() - this.lastMessageTime < this.COOLDOWN_MS) {
      return;
    }

    let msg: Partial<CoachingMessage> | null = null;

    // Rule 1: Eye Contact Loss
    if (metrics.eyeContactPct < 40) {
      msg = {
        severity: "nudge",
        metricReferenced: "eyeContactPct",
        ...this.getTemplate(mode, "eyeContact_low"),
      };
    }
    // Rule 2: Low Energy
    else if (metrics.energyScore < 4) {
      msg = {
        severity: "nudge",
        metricReferenced: "energyScore",
        ...this.getTemplate(mode, "energy_low"),
      };
    }
    // Rule 3: Bad Framing
    else if (metrics.framingScore < 3) {
      msg = {
        severity: "critical",
        metricReferenced: "framingScore",
        ...this.getTemplate(mode, "framing_bad"),
      };
    }

    if (msg && msg.text) {
      useSessionStore.getState().addCoachingMessage({
        text: msg.text,
        severity: msg.severity as "info" | "nudge" | "critical",
        metricReferenced: msg.metricReferenced as keyof LiveMetrics,
        source: "rule",
      });
      this.lastMessageTime = Date.now();
    }
  }

  private getTemplate(mode: string, scenario: string) {
    const templates: Record<string, Record<string, string>> = {
      director: {
        eyeContact_low: "Look at the lens, not the screen.",
        energy_low: "I need more energy on this line. Bring it up.",
        framing_bad: "You're drifting out of frame. Center up.",
      },
      bestie: {
        eyeContact_low: "Hey look in the lens! The audience is right there.",
        energy_low: "You're getting in your head. Shake it out, big smile!",
        framing_bad: "Wait come back to the center, I'm losing you.",
      },
      roast: {
        eyeContact_low: "Staring at yourself won't make the take better. The lens is over there.",
        energy_low: "This is giving 'hostage video'. Blink twice if you need help.",
        framing_bad: "You're half out of frame. Did you forget where the camera is?",
      },
    };

    const text = templates[mode]?.[scenario] || templates["director"][scenario];
    return { text };
  }
}

export const coachingEngine = new CoachingEngine();
