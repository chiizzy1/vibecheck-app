import { create } from "zustand";
import {
  type Session,
  type Take,
  type TakeMetrics,
  type LiveMetrics,
  type CoachingMessage,
  type CaptionResult,
  type PersonalityMode,
  type ContentType,
  type Script,
  COMPOSITE_WEIGHTS,
} from "../types/session";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function computeComposite(m: LiveMetrics): number {
  const raw =
    (m.eyeContactPct / 100) * COMPOSITE_WEIGHTS.eyeContact +
    (m.energyScore / 10) * COMPOSITE_WEIGHTS.energy +
    Math.min(m.smileCount / 3, 1) * COMPOSITE_WEIGHTS.smile +
    (m.framingScore / 10) * COMPOSITE_WEIGHTS.framing +
    (m.postureScore / 10) * COMPOSITE_WEIGHTS.posture +
    (m.hookScore / 10) * COMPOSITE_WEIGHTS.hook;
  return Math.round(raw * 100) / 10; // 0–10 scale
}

const emptyMetrics: LiveMetrics = {
  eyeContactPct: 0,
  smileProbability: 0,
  smileCount: 0,
  energyScore: 0,
  framingScore: 5,
  postureScore: 5,
  hookScore: 0,
};

// --- Store Interface ---

interface SessionState {
  // Current session
  session: Session | null;
  currentTake: Take | null;
  liveMetrics: LiveMetrics;
  isRecording: boolean;
  activeScript: Script | null;

  // Coaching
  coachingMessages: CoachingMessage[];

  // Derived
  bestTake: Take | null;
  sessionDuration: number;

  // Session lifecycle
  startSession: (mode: PersonalityMode, topic: string, contentType: ContentType) => void;
  endSession: () => void;
  setActiveScript: (script: Script | null) => void;

  // Take lifecycle
  startTake: () => number;
  endTake: () => Take | null;
  scoreTake: (metrics: Partial<TakeMetrics>) => void;

  // Live updates
  updateLiveMetrics: (metrics: Partial<LiveMetrics>) => void;
  addCoachingMessage: (msg: Omit<CoachingMessage, "id" | "timestamp">) => void;

  // Results
  setCaption: (caption: CaptionResult) => void;
  setTakeVideo: (takeId: string, videoUri: string, thumbnailUri: string | null) => void;

  // Reset
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  currentTake: null,
  liveMetrics: { ...emptyMetrics },
  isRecording: false,
  activeScript: null,
  coachingMessages: [],
  bestTake: null,
  sessionDuration: 0,

  setActiveScript: (script) => set({ activeScript: script }),

  startSession: (mode, topic, contentType) => {
    const session: Session = {
      id: generateId(),
      mode,
      topic,
      contentType,
      takes: [],
      bestTakeId: null,
      caption: null,
      startedAt: Date.now(),
      endedAt: null,
      syncedAt: null,
    };
    set({
      session,
      currentTake: null,
      liveMetrics: { ...emptyMetrics },
      isRecording: false,
      coachingMessages: [],
      bestTake: null,
    });
  },

  endSession: () => {
    const { session } = get();
    if (!session) return;

    const best = session.takes.length
      ? session.takes.reduce((a, b) => (a.metrics.compositeScore >= b.metrics.compositeScore ? a : b))
      : null;

    set({
      session: {
        ...session,
        endedAt: Date.now(),
        bestTakeId: best?.id ?? null,
      },
      bestTake: best,
      isRecording: false,
      currentTake: null,
    });
  },

  startTake: () => {
    const { session } = get();
    if (!session) return 0;

    const takeNumber = session.takes.length + 1;
    const take: Take = {
      id: generateId(),
      takeNumber,
      startedAt: Date.now(),
      endedAt: null,
      metrics: {
        ...emptyMetrics,
        durationSeconds: 0,
        compositeScore: 0,
        authenticityMoments: 0,
        pacingScore: 5,
      },
      videoUri: null,
      thumbnailUri: null,
      coachingMessages: [],
    };

    set({
      currentTake: take,
      isRecording: true,
      liveMetrics: { ...emptyMetrics },
      coachingMessages: [],
    });

    return takeNumber;
  },

  endTake: () => {
    const { session, currentTake, liveMetrics, coachingMessages } = get();
    if (!session || !currentTake) return null;

    const duration = (Date.now() - currentTake.startedAt) / 1000;
    const composite = computeComposite(liveMetrics);

    const finalTake: Take = {
      ...currentTake,
      endedAt: Date.now(),
      metrics: {
        ...liveMetrics,
        durationSeconds: duration,
        compositeScore: composite,
        authenticityMoments: currentTake.metrics.authenticityMoments,
        pacingScore: currentTake.metrics.pacingScore,
      },
      coachingMessages: [...coachingMessages],
    };

    const updatedTakes = [...session.takes, finalTake];

    set({
      session: { ...session, takes: updatedTakes },
      currentTake: null,
      isRecording: false,
    });

    return finalTake;
  },

  scoreTake: (metrics) => {
    const { currentTake } = get();
    if (!currentTake) return;

    set({
      currentTake: {
        ...currentTake,
        metrics: { ...currentTake.metrics, ...metrics },
      },
    });
  },

  updateLiveMetrics: (partial) => {
    set((state) => ({
      liveMetrics: { ...state.liveMetrics, ...partial },
    }));
  },

  addCoachingMessage: (msg) => {
    const message: CoachingMessage = {
      ...msg,
      id: generateId(),
      timestamp: Date.now(),
    };
    set((state) => ({
      coachingMessages: [...state.coachingMessages, message],
    }));
  },

  setCaption: (caption) => {
    const { session } = get();
    if (!session) return;
    set({ session: { ...session, caption } });
  },

  setTakeVideo: (takeId, videoUri, thumbnailUri) => {
    const { session } = get();
    if (!session) return;

    const takes = session.takes.map((t) => (t.id === takeId ? { ...t, videoUri, thumbnailUri } : t));
    set({ session: { ...session, takes } });
  },

  reset: () => {
    set({
      session: null,
      currentTake: null,
      liveMetrics: { ...emptyMetrics },
      isRecording: false,
      coachingMessages: [],
      bestTake: null,
      sessionDuration: 0,
    });
  },
}));
