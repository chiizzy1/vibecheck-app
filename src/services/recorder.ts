import { useSessionStore } from "../stores/session-store";
import { type TakeMetrics } from "../types/session";

/**
 * Manages the transition of video files from the Camera component
 * into the app's file system and state.
 */
export class RecordingManager {
  /**
   * Called when the camera stops recording.
   * @param sourcePath The temp file path from react-native-vision-camera
   * @param duration Approximate duration of the take
   */
  public async processFinishedVideo(sourcePath: string, duration: number) {
    // In a real implementation:
    // 1. Move file from temp cache to document directory
    // 2. Generate thumbnail using expo-video-thumbnails
    // 3. Compress if needed

    // Mock for now, just pass the path along
    const finalPath = sourcePath;
    const mockThumbnail = "https://picsum.photos/seed/vibecheck/200/300";

    // Let the store know the take is finished, triggering the scoring
    const store = useSessionStore.getState();
    const take = store.endTake();

    if (take) {
      store.setTakeVideo(take.id, finalPath, mockThumbnail);
    }
  }

  /**
   * Triggered when the user hits 'Save & Exit' on the session.
   * Would handle cleanup of unused takes here to save space.
   */
  public async finalizeSession() {
    const state = useSessionStore.getState();
    if (!state.session) return;

    // e.g., delete all take videos except the ones the user marked as kept
    console.log(`[RecordingManager] Finalizing session ${state.session.id}`);
  }
}

export const recordingManager = new RecordingManager();
