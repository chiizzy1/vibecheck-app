// @ts-nocheck
import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "@/src/tw";
import { Animated } from "@/src/tw/animated";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Clapperboard, Square, Zap, Eye, Smile } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { withTiming, useSharedValue, useAnimatedStyle, withRepeat } from "react-native-reanimated";
import { useSessionStore } from "@/src/stores/session-store";
import { coachingEngine } from "@/src/services/coaching-engine";
import { recordingManager } from "@/src/services/recorder";
import { TeleprompterOverlay } from "@/src/components/teleprompter-overlay";

export default function SessionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  // Zustand Store
  const { isRecording, liveMetrics, coachingMessages, startTake, endTake, currentTakeIndex, activeScript } = useSessionStore();

  // Animation for pulsing record button
  const pulseScale = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const toggleRecording = () => {
    if (!isRecording) {
      startTake();
      coachingEngine.start();
      pulseScale.value = withRepeat(withTiming(1.2, { duration: 800 }), -1, true);
    } else {
      coachingEngine.stop();
      pulseScale.value = withTiming(1);

      // MOCK: simulate finishing a recording
      const fakeVideoPath = `file:///temp/take_${Date.now()}.mp4`;
      recordingManager.processFinishedVideo(fakeVideoPath, 15); // 15s mock duration

      // Navigate to results
      router.push("/results");
    }
  };

  // Cleanup coaching engine on unmount
  useEffect(() => {
    return () => coachingEngine.stop();
  }, []);

  if (!permission) return <View className="flex-1 bg-background-dark" />;
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background-dark justify-center items-center p-6">
        <Text className="text-white text-xl text-center font-display mb-6">
          VibeCheck needs camera access to act as your AI director.
        </Text>
        <Pressable onPress={requestPermission} className="bg-primary px-8 py-4 rounded-full">
          <Text className="text-background-dark font-bold font-display text-lg">Grant Access</Text>
        </Pressable>
      </View>
    );
  }

  // Get the most recent coaching message
  const activeMessage = coachingMessages.length > 0 ? coachingMessages[coachingMessages.length - 1] : null;

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar hidden />

      {/* Fullscreen Camera */}
      <View className="absolute inset-0 z-0">
        <CameraView style={{ flex: 1 }} facing="front" />
      </View>

      {/* Teleprompter Overlay */}
      {activeScript && <TeleprompterOverlay script={activeScript.content} isPlaying={isRecording} />}

      {/* Top Left: Take Badge */}
      <View className="absolute top-12 left-6 z-10 flex-row gap-3 items-center">
        <View className="bg-background-dark/80 px-4 py-2 rounded-full border border-primary/50">
          <Text className="text-white font-bold tracking-widest font-display text-sm">TAKE {currentTakeIndex + 1}</Text>
        </View>
        {isRecording && <Text className="text-red-500 font-mono font-bold text-lg tracking-wider">REC</Text>}
      </View>

      {/* Top Right: Live HUD Metrics */}
      <View className="absolute top-12 right-6 z-10 glassmorphism p-4 rounded-3xl w-40">
        <View className="flex-col gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Eye size={16} color="#081113" className="text-gray-400" />
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest font-display">Eye</Text>
            </View>
            <Text className="text-primary font-bold font-display">{liveMetrics.eyeContactPct}%</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Zap size={16} color="#081113" className="text-gray-400" />
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest font-display">Nrg</Text>
            </View>
            <Text className="text-primary font-bold font-display">{liveMetrics.energyScore}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Smile size={16} color="#081113" className="text-gray-400" />
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest font-display">Smile</Text>
            </View>
            <Text className="text-white font-bold font-display">{liveMetrics.smileCount}</Text>
          </View>
        </View>
      </View>

      {/* Center: Coaching Toast */}
      {activeMessage && (
        <View className="absolute top-44 left-6 right-6 z-20 items-center">
          <View
            className={`glassmorphism px-6 py-4 rounded-2xl border-l-4 ${
              activeMessage.severity === "critical"
                ? "border-red-500 bg-red-500/10"
                : activeMessage.severity === "nudge"
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-primary bg-primary/10"
            }`}
          >
            <Text className="text-white font-sans text-center text-lg leading-relaxed shadow-sm">"{activeMessage.text}"</Text>
          </View>
        </View>
      )}

      {/* Bottom Center: Action Bar */}
      <View className="absolute bottom-12 left-0 right-0 z-10 items-center">
        <View className="glassmorphism rounded-[40px] p-2 flex-row items-center justify-between w-[85%]">
          <Pressable className="w-14 h-14 rounded-full items-center justify-center border border-primary/50 bg-background-dark/50">
            <Clapperboard size={24} color="#0dccf2" />
          </Pressable>

          <Pressable onPress={toggleRecording} className="w-20 h-20 items-center justify-center relative">
            <Animated.View
              style={pulseStyle}
              className={`absolute inset-0 rounded-full ${isRecording ? "bg-red-500/30" : "bg-white/10"}`}
            />
            <View className={`w-16 h-16 rounded-full items-center justify-center ${isRecording ? "bg-red-500" : "bg-red-500"}`}>
              {isRecording ? (
                <View className="w-6 h-6 bg-white rounded-sm" />
              ) : (
                <View className="w-14 h-14 border-4 border-white rounded-full bg-transparent" />
              )}
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="w-14 h-14 rounded-full items-center justify-center border border-red-500/50 bg-background-dark/50"
          >
            <Square size={20} fill="#ef4444" color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
