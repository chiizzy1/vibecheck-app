import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "@/src/tw";
import { Animated as AnimatedTW } from "@/src/tw/animated";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, cancelAnimation } from "react-native-reanimated";

interface TeleprompterOverlayProps {
  script: string;
  isPlaying: boolean;
  speedMultiplier?: number; // 1 = normal, 2 = 2x speed
  fontSize?: number;
  opacity?: number;
}

export function TeleprompterOverlay({
  script,
  isPlaying,
  speedMultiplier = 1,
  fontSize = 32,
  opacity = 0.8,
}: TeleprompterOverlayProps) {
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Approximate reading speed: 130 words per minute ~ 2.1 words per second
  const words = script.split(" ").length;
  // Estimate height based on words and font size (very rough heuristic)
  const estimatedHeight = words * (fontSize * 0.4);
  const durationMs = (words / 2.1) * 1000 * (1 / speedMultiplier);

  useEffect(() => {
    if (isPlaying) {
      scrollY.value = withTiming(-estimatedHeight, {
        duration: durationMs,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(scrollY);
    }
  }, [isPlaying, speedMultiplier, estimatedHeight, durationMs]);

  const animatedScrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  // Markdown-like bold formatting for emphasis cues
  const renderText = () => {
    const parts = script.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} className="text-primary font-bold" style={{ fontSize }}>
            {part.replace(/\*\*/g, "")}
          </Text>
        );
      }
      return (
        <Text key={index} className="text-white font-medium" style={{ fontSize, opacity }}>
          {part}
        </Text>
      );
    });
  };

  return (
    <View className="absolute inset-x-0 top-32 bottom-40 overflow-hidden px-8 pointer-events-none z-10">
      {/* 
        We use an animated View instead of actually scrolling a ScrollView
        because Reanimated transform gives us buttery smooth 60/120fps motion 
        compared to relying on JS-driven scroll intervals.
      */}
      <AnimatedTW.View style={animatedScrollStyle} className="mt-[50%]">
        <Text
          className="text-center leading-relaxed"
          style={{ textShadowColor: "rgba(0,0,0,0.8)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
        >
          {renderText()}
        </Text>
      </AnimatedTW.View>

      {/* Center line indicator so the creator knows where to look (near the lens) */}
      <View className="absolute top-[30%] left-4 right-4 h-[2px] bg-primary/30 flex-row justify-between items-center">
        <View className="w-2 h-2 rounded-full bg-primary/50 -ml-1" />
        <View className="w-2 h-2 rounded-full bg-primary/50 -mr-1" />
      </View>
    </View>
  );
}
