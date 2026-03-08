# VibeCheck 🎬

> Your AI director. No bad takes.

VibeCheck is an AI-powered content coaching mobile app designed for creators who want to nail every take. It provides real-time body language analysis, live AI coaching in your ear, an AI script generator, and smart captions that convert.

Built with **Expo** (React Native), **NativeWind** (Tailwind CSS v4), **Zustand**, and the new **Gemini Multimodal Live API**.

---

## ✨ Features

- **👁️ Real-Time Metrics** — On-device ML tracking (ML Kit) for eye contact, energy, posture, smile, framing, and hook detection.
- **🎙️ AI Live Coaching** — Choose a personality (Director, Bestie, Roast) and get real-time whispered feedback powered by Gemini Multimodal Live WebSocket.
- **📜 AI Teleprompter** — Voice-paced scrolling script overlay with markdown support for emphasis formatting.
- **✍️ AI Script Generator** — Need an idea? Just enter a topic. The app generates a Hook + Body + CTA structure and sends it straight to your teleprompter.
- **💬 Smart Captions** — Automatically generate 3 A/B tested caption variants optimized for TikTok, Instagram Reels, or YouTube Shorts, complete with trending hashtags.
- **📊 Analytics Dashboard** — Track your consistency, session stats, and improvement trends with Victory Native charts and AI insights.
- **🚀 One-Tap Export** — Native share sheet integration and deep links to instantly open TikTok or Instagram.

---

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 55](https://expo.dev/) (React Native) + [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind v5](https://www.nativewind.dev/) (Tailwind CSS v4)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with persist middleware.
- **AI & ML**:
  - Vision Camera Frame Processors (`react-native-mlkit-face-detection`, `react-native-mlkit-pose-detection`) for low-latency, on-device analysis.
  - Gemini Multimodal Live API via raw WebSockets (`gemini-client.ts`) for sub-second bidirectional audio/video coaching.
- **Animations**: `react-native-reanimated`
- **Icons**: `lucide-react-native`

---

## 🏗️ Architecture

```text
vibecheck-app/
├── app/                      # Expo Router (Tabs & Modals)
│   ├── (tabs)/               # Record, Scripts, History, Profile
│   ├── session.tsx           # Live Camera HUD & Coaching Entry
│   ├── script-generator.tsx  # AI Scripting UI
│   ├── caption-generator.tsx # Smart Caption UI
│   ├── analytics.tsx         # Performance trends
│   ├── onboarding.tsx        # 3-slide intro flow
│   └── paywall.tsx           # Free vs Pro feature gate
├── src/
│   ├── services/
│   │   ├── metrics-engine.ts # ML metric calculations
│   │   ├── coaching-engine.ts# Rule-based (Free) & Gemini (Pro) wrappers
│   │   ├── gemini-client.ts  # WebSocket manager
│   │   ├── caption-engine.ts # A/B variant generator
│   │   └── paywall.ts        # Subscription gate logic
│   ├── stores/
│   │   ├── session-store.ts  # Active session lifecycle state
│   │   └── user-store.ts     # User prefs, history, saved scripts
│   └── types/                # Strict TS interfaces
└── landing/                  # Official vibecheck.app website
```

---

## 🏃‍♂️ Running Locally

### 1. Requirements

- Node.js >= 18
- Watchman
- Expo CLI
- Ruby / CocoaPods (for iOS builds)
- Android Studio / Xcode

### 2. Environment Variables

You'll need a Google AI Gemini API key to use the Pro coaching features.
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install & Build

This app relies heavily on native modules not present in Expo Go. You **must** build a development client or use EAS prebuild.

```bash
# Install dependencies
npm install

# Prebuild native directories
npx expo prebuild

# Run on iOS Simulator / Device
npx expo run:ios

# Run on Android Emulator / Device
npx expo run:android
```

Alternatively, build a dev client via Expo Application Services (EAS):

```bash
eas build --profile development --platform ios
```

---

## 💰 Monetization Strategy (Implementation Ready)

The app is architected with a strict separation between **Free** and **Pro** tiers via `src/services/paywall.ts`.

- **Free**: Capped at 5 sessions/month, 3 takes/session. Director mode only. Watermarked exports.
- **Pro**: Unlimited sessions, all 3 coaching personalities (powered by live Gemini), AI script/caption generation, HD exports without watermarks.
  _(Currently integrated via a mocked RevenueCat service, ready to drop in native keys)._

---

## 📝 License

Proprietary. All rights reserved.
