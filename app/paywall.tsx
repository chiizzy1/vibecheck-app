// @ts-nocheck
import React from "react";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { Animated } from "@/src/tw/animated";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Crown, Check, X, Zap, Star } from "lucide-react-native";

const FEATURES = [
  { name: "Sessions / month", free: "5", pro: "Unlimited" },
  { name: "Takes / session", free: "3", pro: "Unlimited" },
  { name: "Coaching modes", free: "Director only", pro: "All 3 modes" },
  { name: "AI live coaching", free: false, pro: true },
  { name: "Script generator", free: "3/month", pro: "Unlimited" },
  { name: "Smart captions", free: "Basic", pro: "AI-powered A/B" },
  { name: "Export quality", free: "Watermark", pro: "Clean HD" },
  { name: "Analytics", free: "Basic", pro: "Full dashboard" },
];

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-dark pt-12">
      <View className="absolute top-14 right-6 z-10">
        <Pressable onPress={() => router.back()}>
          <X color="#666" size={24} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-10 pt-4">
          <View className="bg-accent/20 w-20 h-20 rounded-full items-center justify-center mb-6">
            <Crown color="#f20db4" size={40} />
          </View>
          <Text className="text-white font-display text-3xl font-bold text-center mb-2">Go Pro</Text>
          <Text className="text-gray-400 font-sans text-center text-lg max-w-[280px]">
            Unlock the full power of your AI director. No limits.
          </Text>
        </Animated.View>

        {/* Pricing */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} className="flex-row gap-4 mb-10">
          <Pressable className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5 items-center">
            <Text className="text-gray-400 font-display text-sm tracking-widest uppercase mb-2">Monthly</Text>
            <View className="flex-row items-baseline">
              <Text className="text-white font-display text-3xl font-bold">$9</Text>
              <Text className="text-gray-500 font-sans text-sm">/mo</Text>
            </View>
          </Pressable>

          <Pressable className="flex-1 bg-primary/10 border-2 border-primary rounded-3xl p-5 items-center relative">
            <View className="absolute -top-3 bg-primary px-3 py-1 rounded-full">
              <Text className="text-background-dark font-display text-xs font-bold tracking-widest">BEST VALUE</Text>
            </View>
            <Text className="text-primary font-display text-sm tracking-widest uppercase mb-2">Yearly</Text>
            <View className="flex-row items-baseline">
              <Text className="text-white font-display text-3xl font-bold">$69</Text>
              <Text className="text-gray-500 font-sans text-sm">/yr</Text>
            </View>
            <Text className="text-green-400 font-sans text-xs mt-1">Save 36%</Text>
          </Pressable>
        </Animated.View>

        {/* Feature Comparison */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
        >
          <View className="flex-row border-b border-white/10 px-5 py-3">
            <Text className="flex-1 text-gray-400 font-display text-xs tracking-widest uppercase">Feature</Text>
            <Text className="w-20 text-center text-gray-400 font-display text-xs tracking-widest uppercase">Free</Text>
            <Text className="w-20 text-center text-primary font-display text-xs tracking-widest uppercase">Pro</Text>
          </View>

          {FEATURES.map((f, i) => (
            <View
              key={i}
              className={`flex-row px-5 py-3 items-center ${i < FEATURES.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <Text className="flex-1 text-white font-sans text-sm">{f.name}</Text>
              <View className="w-20 items-center">
                {typeof f.free === "boolean" ? (
                  f.free ? (
                    <Check color="#22c55e" size={16} />
                  ) : (
                    <X color="#666" size={16} />
                  )
                ) : (
                  <Text className="text-gray-400 font-mono text-xs text-center">{f.free}</Text>
                )}
              </View>
              <View className="w-20 items-center">
                {typeof f.pro === "boolean" ? (
                  f.pro ? (
                    <Check color="#22c55e" size={16} />
                  ) : (
                    <X color="#666" size={16} />
                  )
                ) : (
                  <Text className="text-primary font-mono text-xs text-center">{f.pro}</Text>
                )}
              </View>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Pressable className="mt-8 bg-primary py-5 rounded-2xl flex-row items-center justify-center">
          <Zap color="#0a0a0a" size={20} />
          <Text className="text-background-dark font-display font-bold text-lg ml-2">Start Free Trial</Text>
        </Pressable>
        <Text className="text-gray-500 font-sans text-center text-xs mt-3">7-day free trial • Cancel anytime</Text>
      </ScrollView>
    </View>
  );
}
