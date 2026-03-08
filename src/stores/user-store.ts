import { create } from "zustand";
import {
  type UserProfile,
  type UserPreferences,
  type SubscriptionTier,
  type SessionSummary,
  type Script,
  FREE_TIER_LIMITS,
} from "../types/session";

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  sessionHistory: SessionSummary[];
  scripts: Script[];
  onboardingComplete: boolean;

  // Auth
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;

  // Subscription
  isPro: () => boolean;
  canStartSession: () => boolean;
  canUseTake: (currentTakeCount: number) => boolean;
  canUseMode: (mode: string) => boolean;
  incrementSessionCount: () => void;

  // Preferences
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;

  // History
  addSessionToHistory: (summary: SessionSummary) => void;
  clearHistory: () => void;

  // Scripts
  saveScript: (script: Script) => void;
  deleteScript: (scriptId: string) => void;
}

const defaultPreferences: UserPreferences = {
  defaultMode: "director",
  hapticFeedback: true,
  autoGenerateCaption: true,
  preferredPlatform: "tiktok",
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  preferences: { ...defaultPreferences },
  sessionHistory: [],
  scripts: [],
  onboardingComplete: false,

  setProfile: (profile) => set({ profile }),

  clearProfile: () => set({ profile: null }),

  isPro: () => {
    const { profile } = get();
    return profile?.tier === "pro";
  },

  canStartSession: () => {
    const { profile } = get();
    if (!profile) return true; // Allow anonymous sessions
    if (profile.tier === "pro") return true;
    return profile.sessionsThisMonth < FREE_TIER_LIMITS.sessionsPerMonth;
  },

  canUseTake: (currentTakeCount) => {
    const { profile } = get();
    if (!profile || profile.tier === "pro") return true;
    return currentTakeCount < FREE_TIER_LIMITS.takesPerSession;
  },

  canUseMode: (mode) => {
    const { profile } = get();
    if (!profile || profile.tier === "pro") return true;
    return (FREE_TIER_LIMITS.allowedModes as readonly string[]).includes(mode);
  },

  incrementSessionCount: () => {
    const { profile } = get();
    if (!profile) return;
    set({
      profile: {
        ...profile,
        sessionsThisMonth: profile.sessionsThisMonth + 1,
        totalSessions: profile.totalSessions + 1,
      },
    });
  },

  updatePreferences: (partial) => {
    set((state) => ({
      preferences: { ...state.preferences, ...partial },
    }));
  },

  completeOnboarding: () => set({ onboardingComplete: true }),

  addSessionToHistory: (summary) => {
    set((state) => ({
      sessionHistory: [summary, ...state.sessionHistory],
    }));
  },

  clearHistory: () => set({ sessionHistory: [] }),

  saveScript: (script) => {
    set((state) => ({
      scripts: [script, ...state.scripts],
    }));
  },

  deleteScript: (scriptId) => {
    set((state) => ({
      scripts: state.scripts.filter((s) => s.id !== scriptId),
    }));
  },
}));
