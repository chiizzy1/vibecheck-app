import { useSessionStore } from "../stores/session-store";
import { type LiveMetrics, type PersonalityMode } from "../types/session";

/**
 * Interface with the Gemini Multimodal Live API via WebSocket.
 * https://ai.google.dev/api/multimodal-live
 */
export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private mode: PersonalityMode = "director";

  // State for exponential backoff reconnection
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private apiKey: string) {}

  public connect(mode: PersonalityMode) {
    if (this.isConnected) return;
    this.mode = mode;

    // Use the beta endpoint for Multimodal Live API
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
  }

  public disconnect() {
    if (this.ws) {
      // Send termination signal if needed by the protocol
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Send a base64 encoded JPEG frame from the camera to Gemini.
   */
  public sendFrame(base64Jpeg: string) {
    if (!this.isConnected || !this.ws) return;

    const message = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: "image/jpeg",
            data: base64Jpeg,
          },
        ],
      },
    };

    try {
      this.ws.send(JSON.stringify(message));
    } catch (e) {
      console.warn("[GeminiLiveClient] Failed to send frame:", e);
    }
  }

  /**
   * Send text context (e.g., current metrics for coaching).
   */
  public sendContext(text: string) {
    if (!this.isConnected || !this.ws) return;

    const message = {
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        turnComplete: true,
      },
    };

    try {
      this.ws.send(JSON.stringify(message));
    } catch (e) {
      console.warn("[GeminiLiveClient] Failed to send context:", e);
    }
  }

  // --- Internals ---

  private handleOpen() {
    console.log("[GeminiLiveClient] Connected");
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Setup initial session config
    this.sendSessionConfig();
  }

  private sendSessionConfig() {
    if (!this.ws) return;

    // Load the correct system instructions based on the mode
    import("../prompts/personalities").then(({ PROMPTS }) => {
      const systemInstruction = PROMPTS[this.mode];

      const configMessage = {
        setup: {
          model: "models/gemini-2.0-flash-exp", // Or appropriate live model
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            // We want JSON out so we can parse severity and display easily
            responseModalities: ["TEXT"], // Could add 'AUDIO' for voice output
          },
        },
      };

      this.ws?.send(JSON.stringify(configMessage));
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      // Typically Blob in React Native, need to read it
      // Let's assume standard string/JSON for simplicity in this mock
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data);
        this.processServerContent(data);
      }
    } catch (e) {
      console.warn("[GeminiLiveClient] Error parsing message:", e);
    }
  }

  private processServerContent(data: any) {
    // The Bidi API returns `serverContent` containing the model's turn
    if (data.serverContent?.modelTurn) {
      const parts = data.serverContent.modelTurn.parts;
      if (parts && parts.length > 0) {
        // Extract text
        const textPart = parts.find((p: any) => p.text);
        if (textPart) {
          // Send to Zustand store
          useSessionStore.getState().addCoachingMessage({
            text: textPart.text,
            severity: "info", // Could parse from JSON if prompted strictly
            metricReferenced: null,
            source: "gemini",
          });
        }
        // Extract Audio if enabled
        const audioPart = parts.find((p: any) => p.inlineData && p.inlineData.mimeType.startsWith("audio/"));
        if (audioPart) {
          // Play the audio chunk ...
        }
      }
    }
  }

  private handleError(error: Event) {
    console.error("[GeminiLiveClient] WebSocket Error:", error);
  }

  private handleClose(event: CloseEvent) {
    console.log(`[GeminiLiveClient] Disconnected: code ${event.code}, reason: ${event.reason}`);
    this.isConnected = false;

    // Exponential backoff reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      this.reconnectAttempts++;
      console.log(`[GeminiLiveClient] Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(this.mode), delay);
    } else {
      console.error("[GeminiLiveClient] Max reconnection attempts reached.");
    }
  }
}

// Global instance
export const geminiClient = new GeminiLiveClient("YOUR_API_KEY_HERE"); // Loaded securely in real app
