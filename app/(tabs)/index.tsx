// @ts-nocheck
import React from "react";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { Clapperboard, Sparkles, Flame } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Animated } from "@/src/tw/animated";
import { FadeInDown, FadeInUp } from "react-native-reanimated";

const MODES = [
  {
    id: "director",
    title: "DIRECTOR MODE",
    desc: "Precise, professional feedback.",
    color: "border-[#0dccf2] shadow-[#0dccf2]",
    bg: "bg-[#0dccf2]/10",
    iconColor: "#0dccf2",
    Icon: Clapperboard,
  },
  {
    id: "bestie",
    title: "BESTIE MODE",
    desc: "Your hype bestie who keeps it real.",
    color: "border-[#f20db4] shadow-[#f20db4]",
    bg: "bg-[#f20db4]/10",
    iconColor: "#f20db4",
    Icon: Sparkles,
    pro: true,
  },
  {
    id: "roast",
    title: "ROAST MODE",
    desc: "Unhinged chaos. Real feedback underneath.",
    color: "border-[#f97316] shadow-[#f97316]",
    bg: "bg-[#f97316]/10",
    iconColor: "#f97316",
    Icon: Flame,
    pro: true,
  },
];

export default function ModeSelector() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background-dark" contentContainerClassName="p-6 pt-16">
      <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-10">
        <Clapperboard size={44} color="#0dccf2" />
        <Text className="text-4xl font-display font-bold text-white tracking-tight uppercase italic mt-3 mb-1">VIBECHECK</Text>
        <Text className="text-gray-400 text-base text-center font-display">Your AI director. No bad takes.</Text>
      </Animated.View>

      <View className="gap-5 flex-1">
        {MODES.map((mode, index) => {
          const { Icon } = mode;
          return (
            <Animated.View key={mode.id} entering={FadeInUp.delay(index * 150 + 400).duration(600)}>
              <Pressable
                onPress={() => router.push(`/session?mode=${mode.id}`)}
                className={`flex-row items-center p-6 rounded-3xl glassmorphism border-[0.5px] ${mode.color} ${mode.bg}`}
              >
                <View className="mr-5">
                  <Icon size={36} color={mode.iconColor} />
                </View>

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xl font-display font-bold text-white tracking-tight">{mode.title}</Text>
                    {mode.pro && (
                      <View className="bg-accent/20 px-2 py-1 rounded-full border border-accent/30">
                        <Text className="text-xs font-bold text-accent tracking-widest">PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-400 text-base leading-tight font-display">{mode.desc}</Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}
