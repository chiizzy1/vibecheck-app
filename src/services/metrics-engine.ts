import { type LiveMetrics } from "../types/session";
import { type RawVisionData } from "./ml-kit-bridge";
import { useSessionStore } from "../stores/session-store";

/**
 * The MetricsEngine consumes a stream of RawVisionData (ideally running
 * 30 times a second), computes running averages and event triggers (like smiles),
 * and updates the Zustand store at a throttled rate for the UI.
 */
export class MetricsEngine {
  private isProcessing = false;
  private frameCount = 0;
  private latestRawData: RawVisionData | null = null;
  private previousRawData: RawVisionData | null = null;

  // Running aggregations for the current take
  private aggregateEyeContactFrames = 0;
  private aggregateSmilesDetected = 0;
  private lastSmileTime = 0;

  // Config
  private readonly SMILE_THRESHOLD = 0.7; // Probability required to count as a smile
  private readonly SMILE_COOLDOWN_MS = 1500; // Prevent Rapid-fire smile counts
  private readonly EYE_CONTACT_YAW_THRESHOLD = 15; // Degrees left/right max
  private readonly EYE_CONTACT_PITCH_THRESHOLD = 10; // Degrees up/down max

  /**
   * Resets the engine state for a new take
   */
  public reset() {
    this.frameCount = 0;
    this.aggregateEyeContactFrames = 0;
    this.aggregateSmilesDetected = 0;
    this.lastSmileTime = 0;
    this.latestRawData = null;
    this.previousRawData = null;
  }

  /**
   * Core loop called by the camera frame processor.
   * Processes the frame and occasionally syncs to the UI store.
   */
  public processFrame(data: RawVisionData) {
    if (!this.isProcessing) return;

    this.frameCount++;
    this.previousRawData = this.latestRawData;
    this.latestRawData = data;

    // 1. Process Eye Contact (Gaze approximation)
    let isLookingAtLens = false;
    if (data.hasFace && data.headEulerAngleY !== undefined && data.headEulerAngleX !== undefined) {
      if (
        Math.abs(data.headEulerAngleY) < this.EYE_CONTACT_YAW_THRESHOLD &&
        Math.abs(data.headEulerAngleX) < this.EYE_CONTACT_PITCH_THRESHOLD
      ) {
        isLookingAtLens = true;
        this.aggregateEyeContactFrames++;
      }
    }

    // 2. Process Smiles
    let currentSmileProb = 0;
    if (data.hasFace && data.smileProbability !== undefined) {
      currentSmileProb = data.smileProbability;
      if (currentSmileProb > this.SMILE_THRESHOLD && data.timestamp - this.lastSmileTime > this.SMILE_COOLDOWN_MS) {
        this.aggregateSmilesDetected++;
        this.lastSmileTime = data.timestamp;
      }
    }

    // 3. Process Energy (Motion delta across frames)
    const energyScore = this.computeEnergyScore(this.previousRawData, this.latestRawData);

    // 4. Process Posture (Shoulder alignment)
    const postureScore = this.computePostureScore(data);

    // 5. Process Framing (Rule of thirds)
    const framingScore = this.computeFramingScore(data);

    // Calculate aggregate percentages
    const eyeContactPct = this.frameCount > 0 ? Math.round((this.aggregateEyeContactFrames / this.frameCount) * 100) : 0;

    // Update Zustand store (throttle this in a real implementation to save renders)
    // We update every ~15 frames (twice a second at 30fps)
    if (this.frameCount % 15 === 0) {
      useSessionStore.getState().updateLiveMetrics({
        eyeContactPct,
        smileProbability: currentSmileProb,
        smileCount: this.aggregateSmilesDetected,
        energyScore,
        postureScore,
        framingScore,
        // Hook score is only calculated in the first 3 seconds, we'll implement later
        hookScore: 5,
      });
    }
  }

  public start() {
    this.isProcessing = true;
  }

  public stop() {
    this.isProcessing = false;
  }

  // --- Internals ---

  private computeEnergyScore(prev: RawVisionData | null, curr: RawVisionData | null): number {
    if (!prev || !curr || !prev.posePoints || !curr.posePoints) return 5; // Default

    // Very naive motion delta calculation based on nose and shoulders
    let delta = 0;
    const points = ["nose", "leftShoulder", "rightShoulder"] as const;

    for (const pt of points) {
      const p1 = prev.posePoints[pt];
      const p2 = curr.posePoints[pt];
      if (p1 && p2) {
        delta += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      }
    }

    // Map delta to 0-10 scale (requires empirical tuning)
    const normalizedEnergy = Math.min(Math.max(delta * 10, 0), 10);
    return Math.round(normalizedEnergy * 10) / 10;
  }

  private computePostureScore(data: RawVisionData): number {
    if (!data.posePoints || !data.posePoints.leftShoulder || !data.posePoints.rightShoulder) {
      return 5;
    }

    // Check if shoulders are roughly level
    const leftY = data.posePoints.leftShoulder.y;
    const rightY = data.posePoints.rightShoulder.y;
    const slope = Math.abs(leftY - rightY);

    // smaller slope = better posture (closer to 10)
    const score = Math.max(10 - slope * 20, 0);
    return Math.round(score * 10) / 10;
  }

  private computeFramingScore(data: RawVisionData): number {
    if (!data.faceBoundingBox) return 5;

    // Ideal framing: Face centered horizontally, upper 1/3 vertically
    // Assuming normalized coordinates (0-1) for simplicity here
    const { x, y } = data.faceBoundingBox;
    const centerX = x + data.faceBoundingBox.width / 2;
    const centerY = y + data.faceBoundingBox.height / 2;

    const horizontalPenalty = Math.abs(0.5 - centerX) * 10;
    const verticalPenalty = Math.abs(0.33 - centerY) * 10;

    const score = Math.max(10 - horizontalPenalty - verticalPenalty, 0);
    return Math.round(score * 10) / 10;
  }
}

// Singleton instance
export const metricsEngine = new MetricsEngine();
