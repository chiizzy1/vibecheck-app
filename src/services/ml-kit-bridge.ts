import { type LiveMetrics, COMPOSITE_WEIGHTS } from "../types/session";

/**
 * Interface representing the raw outputs from ML Kit vision processing.
 * This abstracts away the specific native module implementation so we can
 * test the metrics engine independently.
 */
export interface RawVisionData {
  timestamp: number;

  // Face Detection Data
  hasFace: boolean;
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smileProbability?: number;
  headEulerAngleX?: number; // Pitch (up/down)
  headEulerAngleY?: number; // Yaw (left/right)
  headEulerAngleZ?: number; // Roll (tilt)
  faceBoundingBox?: { x: number; y: number; width: number; height: number };

  // Pose Detection Data (33 points)
  // We only track key points for energy and posture rules
  posePoints?: {
    leftShoulder?: { x: number; y: number };
    rightShoulder?: { x: number; y: number };
    leftHip?: { x: number; y: number };
    rightHip?: { x: number; y: number };
    nose?: { x: number; y: number };
  };
}
