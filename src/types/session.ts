/**
 * Core data model for VibeCheck sessions, takes, and metrics.
 */

// --- Coaching ---

export type PersonalityMode = "director" | "bestie" | "roast";

export type ContentType = "storytime" | "grwm" | "tutorial" | "reaction" | "outfit_check" | "day_in_life" | "other";

export interface CoachingMessage {
  id: string;
  text: string;
  severity: "info" | "nudge" | "critical";
  metricReferenced: keyof LiveMetrics | null;
  timestamp: number;
  source: "rule" | "gemini";
}

// --- Live Metrics (computed per-frame) ---

export interface LiveMetrics {
  eyeContactPct: number; // 0–100
  smileProbability: number; // 0.0–1.0 (current frame)
  smileCount: number; // genuine smiles this take
  energyScore: number; // 0–10
  framingScore: number; // 0–10 (rule-of-thirds alignment)
  postureScore: number; // 0–10 (shoulder alignment)
  hookScore: number; // 0–10 (first 3s energy + eye contact)
}

// --- Take ---

export interface TakeMetrics extends LiveMetrics {
  durationSeconds: number;
  compositeScore: number; // 0–10 weighted aggregate
  authenticityMoments: number; // genuine smiles held > 0.5s
  pacingScore: number; // 0–10 (energy variance — too flat or too erratic is bad)
}

export interface Take {
  id: string;
  takeNumber: number;
  startedAt: number; // epoch ms
  endedAt: number | null;
  metrics: TakeMetrics;
  videoUri: string | null;
  thumbnailUri: string | null;
  coachingMessages: CoachingMessage[];
}

// --- Session ---

export interface CaptionResult {
  caption: string;
  hashtags: string;
  aesthetic: string;
  platform: "tiktok" | "reels" | "shorts";
  variants: string[]; // A/B alternatives
}

export interface Session {
  id: string;
  mode: PersonalityMode;
  topic: string;
  contentType: ContentType;
  takes: Take[];
  bestTakeId: string | null;
  caption: CaptionResult | null;
  startedAt: number;
  endedAt: number | null;
  syncedAt: number | null; // null = not yet synced to Supabase
}

// --- Script (Teleprompter) ---

export interface Script {
  id: string;
  title?: string;
  content: string;
  estimatedDuration: number;
  topic: string;
  contentType: ContentType;
  createdAt: number;
}

// --- User ---

export type SubscriptionTier = "free" | "pro";

export interface UserPreferences {
  defaultMode: PersonalityMode;
  hapticFeedback: boolean;
  autoGenerateCaption: boolean;
  preferredPlatform: "tiktok" | "reels" | "shorts";
}

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUri: string | null;
  tier: SubscriptionTier;
  sessionsThisMonth: number;
  totalSessions: number;
  joinedAt: number;
}

// --- Analytics ---

export interface SessionSummary {
  sessionId: string;
  date: number;
  mode: PersonalityMode;
  bestScore: number;
  totalTakes: number;
  topic: string;
  thumbnailUri: string | null;
}

export interface TrendDataPoint {
  date: number;
  eyeContact: number;
  energy: number;
  compositeScore: number;
}

// --- Constants ---

export const FREE_TIER_LIMITS = {
  sessionsPerMonth: 5,
  takesPerSession: 3,
  allowedModes: ["director"] as PersonalityMode[],
  geminiCoaching: false,
  watermarkExport: true,
} as const;

export const COMPOSITE_WEIGHTS = {
  eyeContact: 0.3,
  energy: 0.25,
  smile: 0.15,
  framing: 0.1,
  posture: 0.1,
  hook: 0.1,
} as const;
