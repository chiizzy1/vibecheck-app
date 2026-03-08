import { FREE_TIER_LIMITS, type PersonalityMode } from "../types/session";

/**
 * Mock paywall service. In production this would integrate with
 * RevenueCat SDK for App Store / Play Store subscriptions.
 */

interface PaywallConfig {
  isPro: boolean;
  sessionsThisMonth: number;
}

class PaywallService {
  /**
   * Check if user can start a new session.
   */
  canStartSession(config: PaywallConfig): { allowed: boolean; reason?: string } {
    if (config.isPro) return { allowed: true };

    if (config.sessionsThisMonth >= FREE_TIER_LIMITS.sessionsPerMonth) {
      return {
        allowed: false,
        reason: `You've used all ${FREE_TIER_LIMITS.sessionsPerMonth} free sessions this month. Upgrade to Pro for unlimited sessions.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if the selected mode is available.
   */
  canUseMode(mode: PersonalityMode, isPro: boolean): { allowed: boolean; reason?: string } {
    if (isPro) return { allowed: true };

    const allowed = (FREE_TIER_LIMITS.allowedModes as readonly string[]).includes(mode);
    if (!allowed) {
      return {
        allowed: false,
        reason: `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode is a Pro feature. Upgrade to unlock all coaching personalities.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user has takes remaining in this session.
   */
  canStartTake(takeCount: number, isPro: boolean): { allowed: boolean; reason?: string } {
    if (isPro) return { allowed: true };

    if (takeCount >= FREE_TIER_LIMITS.takesPerSession) {
      return {
        allowed: false,
        reason: `Free tier is limited to ${FREE_TIER_LIMITS.takesPerSession} takes per session. Go Pro for unlimited takes.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if Gemini coaching is available.
   */
  canUseGeminiCoaching(isPro: boolean): boolean {
    return isPro || FREE_TIER_LIMITS.geminiCoaching;
  }

  /**
   * Whether exports should include a watermark.
   */
  shouldWatermark(isPro: boolean): boolean {
    return !isPro && FREE_TIER_LIMITS.watermarkExport;
  }

  /**
   * Mock: In production, this triggers RevenueCat's paywall UI.
   */
  async presentPaywall(): Promise<boolean> {
    console.log("[PaywallService] Presenting paywall (mock)");
    return false; // Mock: user didn't purchase
  }
}

export const paywallService = new PaywallService();
