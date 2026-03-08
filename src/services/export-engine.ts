import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Linking, Platform } from "react-native";

interface ExportOptions {
  videoUri: string;
  caption?: string;
  hashtags?: string;
  watermark: boolean; // true for free tier
}

class ExportEngine {
  /**
   * Share the best take video with a pre-populated caption.
   * Uses the native share sheet on both platforms.
   */
  async shareVideo(options: ExportOptions): Promise<void> {
    const { videoUri, caption, hashtags } = options;

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.warn("Sharing is not available on this device.");
      return;
    }

    const fullCaption = [caption, hashtags].filter(Boolean).join("\n\n");

    await Sharing.shareAsync(videoUri, {
      mimeType: "video/mp4",
      dialogTitle: "Share your take",
      UTI: "public.movie",
    });
  }

  /**
   * Deep-link to TikTok or Instagram with the video.
   * On iOS, TikTok supports share extension; on Android, uses intent.
   */
  async shareToTikTok(videoUri: string): Promise<void> {
    const tiktokUrl = Platform.select({
      ios: "tiktok://",
      android: "com.zhiliaoapp.musically",
      default: "https://www.tiktok.com/upload",
    });

    const canOpen = await Linking.canOpenURL(tiktokUrl!);
    if (canOpen) {
      await Linking.openURL(tiktokUrl!);
    } else {
      await Linking.openURL("https://www.tiktok.com/upload");
    }
  }

  async shareToInstagram(videoUri: string): Promise<void> {
    const igUrl = "instagram://library";
    const canOpen = await Linking.canOpenURL(igUrl);
    if (canOpen) {
      await Linking.openURL(igUrl);
    } else {
      await Linking.openURL("https://www.instagram.com/");
    }
  }

  /**
   * Copy caption text to clipboard for manual paste.
   */
  async copyCaption(caption: string, hashtags: string): Promise<string> {
    return `${caption}\n\n${hashtags}`;
  }
}

export const exportEngine = new ExportEngine();
