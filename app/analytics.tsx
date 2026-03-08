import React from "react";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { useRouter } from "expo-router";
import { ChevronLeft, TrendingUp, Activity, Eye, Play } from "lucide-react-native";
import { useUserStore } from "@/src/stores/user-store";

export default function AnalyticsScreen() {
  const router = useRouter();
  const { sessionHistory } = useUserStore();

  // Mock data for charts
  const mockTrendData = [
    { day: "Mon", score: 65, eye: 70, nrg: 60 },
    { day: "Tue", score: 72, eye: 75, nrg: 65 },
    { day: "Wed", score: 68, eye: 65, nrg: 70 },
    { day: "Thu", score: 85, eye: 88, nrg: 82 },
    { day: "Fri", score: 91, eye: 90, nrg: 88 },
  ];

  return (
    <View className="flex-1 bg-background-dark pt-12">
      <View className="flex-row items-center px-6 pb-4 border-b border-white/10">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text className="text-white font-display text-xl font-bold flex-1">Analytics</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Stats */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5">
            <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center mb-3">
              <TrendingUp color="#0dccf2" size={20} />
            </View>
            <Text className="text-gray-400 font-display text-sm tracking-widest uppercase mb-1">Avg Score</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-white font-display text-3xl font-bold">84</Text>
              <Text className="text-green-400 font-sans text-sm font-bold">+12%</Text>
            </View>
          </View>

          <View className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5">
            <View className="bg-accent/20 w-10 h-10 rounded-full items-center justify-center mb-3">
              <Play color="#f20db4" size={20} />
            </View>
            <Text className="text-gray-400 font-display text-sm tracking-widest uppercase mb-1">Sessions</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-white font-display text-3xl font-bold">12</Text>
              <Text className="text-gray-400 font-sans text-sm font-bold">this week</Text>
            </View>
          </View>
        </View>

        {/* Chart Area */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white font-display text-lg font-bold">Performance Trend</Text>
            <View className="flex-row gap-2">
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <Text className="text-gray-400 text-xs font-display">Score</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 rounded-full bg-accent" />
                <Text className="text-gray-400 text-xs font-display">Eye</Text>
              </View>
            </View>
          </View>

          <View className="h-48 items-center justify-center border-t border-b border-white/10 py-4">
            {/* Placeholder for Victory Native Chart (to avoid peer dep issues in standard setup, we use a placeholder visual first) */}
            <Text className="text-gray-500 font-mono text-sm">(Victory Chart Area)</Text>
            <View className="absolute inset-0 flex-row items-end justify-between px-2 pt-8">
              {mockTrendData.map((d, i) => (
                <View key={i} className="items-center gap-2">
                  <View
                    className="w-8 bg-primary/20 rounded-t-sm justify-end items-center"
                    style={{ height: `${d.score}%` as any }}
                  >
                    <View className="w-full bg-primary rounded-t-sm" style={{ height: 4 }} />
                  </View>
                  <Text className="text-gray-500 text-xs font-display">{d.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Insights */}
        <Text className="text-white font-display text-lg font-bold mb-4">AI Insights</Text>
        <View className="gap-3 mb-8">
          <View className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex-row items-center">
            <View className="bg-primary/20 p-2 rounded-full mr-4">
              <Eye color="#0dccf2" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold font-display mb-1">Eye Contact Improved</Text>
              <Text className="text-gray-300 font-sans text-sm">
                You held eye contact 15% longer this week compared to last week.
              </Text>
            </View>
          </View>

          <View className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-4 flex-row items-center">
            <View className="bg-yellow-400/20 p-2 rounded-full mr-4">
              <Activity color="#eab308" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold font-display mb-1">Pacing is too fast</Text>
              <Text className="text-gray-300 font-sans text-sm">
                Your speech rate jumps when you glance away from the lens. Try breathing between hooks.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
