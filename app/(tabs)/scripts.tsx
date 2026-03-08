// @ts-nocheck
import React from "react";
import { View, Text, ScrollView, Pressable } from "@/src/tw";
import { Animated } from "@/src/tw/animated";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { FileText, Sparkles, Plus, Trash2 } from "lucide-react-native";
import { useUserStore } from "@/src/stores/user-store";

export default function ScriptsTab() {
  const router = useRouter();
  const { scripts, deleteScript } = useUserStore();

  return (
    <View className="flex-1 bg-background-dark pt-14">
      <View className="flex-row items-center justify-between px-6 pb-4 border-b border-white/10">
        <Text className="text-white font-display text-2xl font-bold">Scripts</Text>
        <Pressable
          onPress={() => router.push("/script-generator")}
          className="bg-primary px-4 py-2 rounded-full flex-row items-center gap-2"
        >
          <Plus color="#0a0a0a" size={16} />
          <Text className="text-background-dark font-display text-sm font-bold">New</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {scripts.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(600)} className="items-center py-20">
            <View className="bg-white/5 p-6 rounded-full mb-6">
              <FileText color="#555" size={48} />
            </View>
            <Text className="text-white font-display text-xl mb-2">No scripts yet</Text>
            <Text className="text-gray-400 text-center font-sans mb-8">
              Generate AI-powered scripts for your takes.{"\n"}Hook + body + CTA, ready to teleprompter.
            </Text>
            <Pressable
              onPress={() => router.push("/script-generator")}
              className="bg-primary px-8 py-4 rounded-full flex-row items-center gap-2"
            >
              <Sparkles color="#0a0a0a" size={18} />
              <Text className="text-background-dark font-bold font-display">Generate Script</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <View className="gap-4">
            {scripts.map((script, i) => (
              <Animated.View key={script.id} entering={FadeInUp.delay(i * 100).duration(400)}>
                <Pressable
                  onPress={() => router.push("/script-generator")}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-white font-display font-bold text-lg flex-1" numberOfLines={1}>
                      {script.title || script.topic}
                    </Text>
                    <Pressable onPress={() => deleteScript(script.id)} className="p-2 -mr-2">
                      <Trash2 color="#555" size={16} />
                    </Pressable>
                  </View>
                  <Text className="text-gray-400 font-sans text-sm" numberOfLines={3}>
                    {script.content}
                  </Text>
                  <View className="flex-row items-center mt-3 gap-3">
                    <View className="bg-primary/10 px-2 py-1 rounded">
                      <Text className="text-primary font-mono text-xs">{script.contentType}</Text>
                    </View>
                    <Text className="text-gray-600 font-mono text-xs">~{Math.round(script.estimatedDuration / 60)}min</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
