// @ts-nocheck
import React from "react";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { Animated } from "@/src/tw/animated";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { User, Crown, Settings, LogOut, ChevronRight, Bell, Shield, Palette, HelpCircle } from "lucide-react-native";
import { useUserStore } from "@/src/stores/user-store";

export default function ProfileScreen() {
  const router = useRouter();
  const isPro = useUserStore((s) => s.isPro());
  const profile = useUserStore((s) => s.profile);

  const MENU_ITEMS = [
    { icon: Crown, label: isPro ? "Manage Subscription" : "Upgrade to Pro", color: "#f20db4", route: "/paywall" },
    { icon: Bell, label: "Notifications", color: "#0dccf2", route: null },
    { icon: Palette, label: "Preferences", color: "#f97316", route: null },
    { icon: Shield, label: "Privacy Policy", color: "#22c55e", route: null },
    { icon: HelpCircle, label: "Help & Support", color: "#eab308", route: null },
  ];

  return (
    <View className="flex-1 bg-background-dark pt-12">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Avatar + Name */}
        <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-10">
          <View className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 items-center justify-center mb-4">
            <User color="#666" size={40} />
          </View>
          <Text className="text-white font-display text-2xl font-bold mb-1">{profile?.displayName || "Creator"}</Text>
          <Text className="text-gray-400 font-sans text-sm mb-4">{profile?.email || "Sign in to sync across devices"}</Text>
          {isPro ? (
            <View className="bg-accent/20 border border-accent/30 px-4 py-1 rounded-full">
              <Text className="text-accent font-display text-xs font-bold tracking-widest">PRO MEMBER</Text>
            </View>
          ) : (
            <Pressable onPress={() => router.push("/paywall")} className="bg-primary px-6 py-2 rounded-full">
              <Text className="text-background-dark font-display font-bold">Upgrade to Pro</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} className="flex-row gap-4 mb-10">
          <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
            <Text className="text-white font-display text-2xl font-bold">{profile?.totalSessions || 0}</Text>
            <Text className="text-gray-400 font-display text-xs tracking-widest uppercase mt-1">Sessions</Text>
          </View>
          <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
            <Text className="text-white font-display text-2xl font-bold">{profile?.sessionsThisMonth || 0}/5</Text>
            <Text className="text-gray-400 font-display text-xs tracking-widest uppercase mt-1">This Month</Text>
          </View>
          <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
            <Text className="text-white font-display text-2xl font-bold">84</Text>
            <Text className="text-gray-400 font-display text-xs tracking-widest uppercase mt-1">Best Score</Text>
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
        >
          {MENU_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={i}
                onPress={() => item.route && router.push(item.route)}
                className={`flex-row items-center px-5 py-4 ${i < MENU_ITEMS.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon color={item.color} size={18} />
                </View>
                <Text className="text-white font-sans flex-1">{item.label}</Text>
                <ChevronRight color="#444" size={18} />
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Sign Out */}
        <Pressable className="flex-row items-center justify-center mt-8 py-4">
          <LogOut color="#ef4444" size={18} />
          <Text className="text-red-400 font-display font-bold ml-2">Sign Out</Text>
        </Pressable>

        <Text className="text-gray-600 font-mono text-xs text-center mt-4">VibeCheck v1.0.0</Text>
      </ScrollView>
    </View>
  );
}
