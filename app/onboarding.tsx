// @ts-nocheck
import React, { useState, useRef } from "react";
import { Dimensions, FlatList } from "react-native";
import { View, Text, Pressable } from "@/src/tw";
import { Animated } from "@/src/tw/animated";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Clapperboard, Sparkles, TrendingUp, ArrowRight, Check } from "lucide-react-native";
import { useUserStore } from "@/src/stores/user-store";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: Clapperboard,
    iconColor: "#0dccf2",
    title: "Film with confidence",
    subtitle: "Point your camera and start talking. Our AI watches your body language, eye contact, and energy in real-time.",
    bg: "bg-[#0dccf2]/5",
  },
  {
    id: "2",
    icon: Sparkles,
    iconColor: "#f20db4",
    title: "Get coached live",
    subtitle:
      "Pick a personality — Director, Bestie, or Roast — and get real-time feedback as you record. Like having a producer in your ear.",
    bg: "bg-[#f20db4]/5",
  },
  {
    id: "3",
    icon: TrendingUp,
    iconColor: "#22c55e",
    title: "Level up your content",
    subtitle: "Track your improvement over time with AI analytics, auto-generated captions, and one-tap social sharing.",
    bg: "bg-[#22c55e]/5",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { completeOnboarding } = useUserStore();

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      setActiveIndex(activeIndex + 1);
    } else {
      completeOnboarding();
      router.replace("/");
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* Skip button */}
      <View className="absolute top-14 right-6 z-10">
        <Pressable onPress={handleSkip}>
          <Text className="text-gray-400 font-display font-bold text-sm tracking-widest">SKIP</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item, index }) => {
          const Icon = item.icon;
          return (
            <View style={{ width }} className="flex-1 justify-center items-center px-10">
              <Animated.View
                entering={FadeInDown.delay(200).duration(600)}
                className={`w-32 h-32 rounded-full items-center justify-center mb-12 ${item.bg}`}
              >
                <Icon size={56} color={item.iconColor} />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400).duration(600)} className="items-center">
                <Text className="text-white font-display text-3xl font-bold text-center mb-4">{item.title}</Text>
                <Text className="text-gray-400 font-sans text-lg text-center leading-relaxed max-w-[300px]">{item.subtitle}</Text>
              </Animated.View>
            </View>
          );
        }}
      />

      {/* Bottom area */}
      <View className="px-10 pb-14">
        {/* Dots */}
        <View className="flex-row justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-8 bg-primary" : "w-2 bg-white/20"}`}
            />
          ))}
        </View>

        {/* CTA button */}
        <Pressable onPress={handleNext} className="bg-primary py-5 rounded-2xl flex-row items-center justify-center">
          {activeIndex === SLIDES.length - 1 ? (
            <>
              <Check color="#0a0a0a" size={20} />
              <Text className="text-background-dark font-display font-bold text-lg ml-2">Let's Go</Text>
            </>
          ) : (
            <>
              <Text className="text-background-dark font-display font-bold text-lg mr-2">Next</Text>
              <ArrowRight color="#0a0a0a" size={20} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
