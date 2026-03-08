// @ts-nocheck
import React from "react";
import { Image } from "react-native";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { useRouter } from "expo-router";
import { ChevronLeft, Calendar, Star, Clock, Clapperboard } from "lucide-react-native";
import { useUserStore } from "@/src/stores/user-store";
import { format } from "date-fns";

export default function HistoryScreen() {
  const router = useRouter();
  const { sessionHistory } = useUserStore();

  // If we have no history, show some mock data for the prototype
  const history =
    sessionHistory.length > 0
      ? sessionHistory
      : [
          {
            sessionId: "mock-1",
            date: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            mode: "director",
            bestScore: 88,
            totalTakes: 3,
            topic: "How to build an audience",
            thumbnailUri: "https://picsum.photos/seed/vibecheck/200/300",
          },
          {
            sessionId: "mock-2",
            date: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
            mode: "bestie",
            bestScore: 72,
            totalTakes: 5,
            topic: "Morning routine vlog",
            thumbnailUri: "https://picsum.photos/seed/morning/200/300",
          },
          {
            sessionId: "mock-3",
            date: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
            mode: "roast",
            bestScore: 65,
            totalTakes: 12,
            topic: "React Native tutorial",
            thumbnailUri: "https://picsum.photos/seed/code/200/300",
          },
        ];

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "director":
        return "text-[#0dccf2]";
      case "bestie":
        return "text-[#f20db4]";
      case "roast":
        return "text-[#f97316]";
      default:
        return "text-white";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <View className="flex-1 bg-background-dark pt-12">
      <View className="flex-row items-center justify-between px-6 pb-4 border-b border-white/10">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
            <ChevronLeft color="white" size={24} />
          </Pressable>
          <Text className="text-white font-display text-xl font-bold">Session History</Text>
        </View>
        <Pressable onPress={() => router.push("/analytics")}>
          <Text className="text-primary font-bold font-display tracking-widest text-sm">ANALYTICS</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {history.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white/5 p-6 rounded-full mb-6">
              <Clapperboard color="#666" size={48} />
            </View>
            <Text className="text-white font-display text-xl mb-2">No takes yet</Text>
            <Text className="text-gray-400 text-center font-sans">
              Your recorded sessions will appear here.{"\n"}Time to film something great!
            </Text>
            <Pressable onPress={() => router.push("/")} className="mt-8 bg-primary px-8 py-4 rounded-full">
              <Text className="text-background-dark font-bold font-display">Start a Session</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            {history.map((session) => (
              <Pressable
                key={session.sessionId}
                // In a real app we'd navigate to a specific session details view
                onPress={() => console.log("View session", session.sessionId)}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center"
              >
                <View className="w-16 h-20 rounded-xl overflow-hidden mr-4 border border-white/20">
                  <Image
                    source={{ uri: session.thumbnailUri || "https://picsum.photos/200/300" }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/20" />
                </View>

                <View className="flex-1">
                  <Text className="text-white font-display text-lg font-bold mb-1" numberOfLines={1}>
                    {session.topic}
                  </Text>

                  <View className="flex-row items-center gap-3 mb-2">
                    <View className="flex-row items-center">
                      <Calendar color="#666" size={12} className="mr-1" />
                      <Text className="text-gray-400 text-xs font-mono">{format(new Date(session.date), "MMM d, yyyy")}</Text>
                    </View>
                    <View className="w-1 h-1 rounded-full bg-gray-600" />
                    <Text className={`text-xs font-bold uppercase tracking-widest font-display ${getModeColor(session.mode)}`}>
                      {session.mode}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-white/10 px-2 py-1 rounded gap-1">
                      <Star color="#eab308" size={12} />
                      <Text className={`font-bold font-display text-xs ${getScoreColor(session.bestScore)}`}>
                        {session.bestScore}/100
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                      <Clock color="#666" size={12} />
                      <Text className="text-gray-400 text-xs font-mono">{session.totalTakes} takes</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
