// @ts-nocheck
import React from "react";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { Download, Sparkles, Zap, Hash } from "lucide-react-native";
import { Animated } from "@/src/tw/animated";
import { useRouter } from "expo-router";

export default function ResultsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background-dark" contentContainerClassName="p-6 pt-20">
      <View className="items-center mb-8">
        <Text className="text-3xl font-display font-bold text-primary tracking-tighter uppercase italic mb-1">
          SESSION RESULTS
        </Text>
        <Text className="text-gray-400 text-sm font-display">30-second storytime about missing my flight</Text>
      </View>

      {/* Best Take Hero */}
      <View className="p-6 rounded-3xl glassmorphism border-primary/30 items-center justify-center mb-6">
        <Text className="text-white text-lg font-display mb-1">🏆 Best Take: Take 2</Text>
        <Text className="text-6xl font-black text-white font-display tracking-tighter">
          8.4<Text className="text-2xl text-gray-400">/10</Text>
        </Text>
      </View>

      <View className="flex-row gap-4 mb-6">
        {/* Eye Contact Donut */}
        <View className="flex-1 p-5 rounded-3xl glassmorphism border-white/5 items-center justify-center">
          <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-3 font-display">Eye Contact</Text>
          <View className="w-20 h-20 rounded-full border-4 border-primary/20 items-center justify-center relative">
            {/* SVG circle would go here in full implementation */}
            <View
              className="absolute inset-0 border-4 border-primary rounded-full"
              style={{ borderRightColor: "transparent", transform: [{ rotate: "-45deg" }] }}
            />
            <Text className="text-xl font-bold text-white font-display">78%</Text>
          </View>
        </View>

        {/* Energy Bar Chart */}
        <View className="flex-1 p-5 rounded-3xl glassmorphism border-white/5 items-center justify-between">
          <View className="flex-row justify-between w-full items-start mb-2">
            <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest font-display w-12">Energy Score</Text>
            <Zap size={16} color="#f20db4" />
          </View>
          <View className="flex-row items-end gap-1 h-12 w-full justify-between">
            {[40, 60, 80, 100, 70, 50, 40].map((h, i) => (
              <View
                key={i}
                className={`w-2 rounded-t-sm ${i === 3 ? "bg-accent shadow-[0_0_10px_#f20db4]" : "bg-accent/40"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </View>
          <Text className="text-2xl font-black text-accent font-display mt-2 w-full text-left">
            7.2<Text className="text-sm text-gray-400">/10</Text>
          </Text>
        </View>
      </View>

      {/* Aesthetic Profile */}
      <View className="p-6 rounded-3xl glassmorphism border-0 iridescent-border items-center justify-center text-center gap-2 mb-6 shadow-2xl overflow-hidden relative">
        <View className="absolute top-2 right-4 bg-primary/20 px-2 py-1 rounded-full">
          <Text className="text-[9px] font-bold text-primary uppercase font-display tracking-widest">AI Analysis</Text>
        </View>
        <View className="w-12 h-12 rounded-full iridescent-gradient items-center justify-center mb-2">
          <Sparkles size={20} color="#081113" />
        </View>
        <Text className="text-gray-400 text-xs font-medium font-display uppercase tracking-widest">Aesthetic Profile</Text>
        <Text className="text-3xl font-black italic tracking-tighter text-white font-display">Clean Girl ✨</Text>
      </View>

      {/* TikTok Caption */}
      <View className="p-6 rounded-3xl glassmorphism border-white/5 mb-8">
        <View className="flex-row items-center gap-2 mb-4">
          <Hash size={16} color="#0dccf2" />
          <Text className="font-bold text-xs uppercase tracking-widest text-white font-display">Generated Caption</Text>
        </View>
        <View className="bg-black/40 p-4 rounded-2xl mb-4">
          <Text className="text-sm leading-relaxed italic text-gray-300 font-display">
            "Pov: you think you have time for an iced matcha before boarding 😭 the sprint through terminal 4 was a movie"
          </Text>
          <Text className="text-xs text-primary mt-3 font-display font-medium">
            #storytime #airportdiaries #cleangirlaesthetic #traveltok
          </Text>
        </View>
        <Pressable className="bg-primary/10 border border-primary/40 py-3 rounded-xl flex-row items-center justify-center gap-2">
          <Download size={14} color="#0dccf2" />
          <Text className="text-primary font-bold font-display text-sm">Copy to Clipboard</Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View className="gap-3 mb-10">
        <Pressable onPress={() => router.push("/")} className="bg-primary py-4 rounded-full items-center justify-center">
          <Text className="text-background-dark font-black font-display text-lg uppercase tracking-wider">Film Again</Text>
        </Pressable>
        <Pressable className="py-4 rounded-full items-center justify-center border border-white/20">
          <Text className="text-white font-bold font-display text-base">Share Results</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
