// @ts-nocheck
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "@/src/tw";
import { useRouter } from "expo-router";
import { ChevronLeft, Wand2, Hash, Edit3, Type, Save } from "lucide-react-native";
import { captionEngine } from "@/src/services/caption-engine";

export default function CaptionGeneratorScreen() {
  const router = useRouter();

  const [aesthetic, setAesthetic] = useState<"minimalist" | "hype" | "educational">("hype");
  const [platform, setPlatform] = useState<"tiktok" | "reels" | "shorts">("tiktok");

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null); // Uses CaptionResult from types
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [customHashtags, setCustomHashtags] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);

    // In a real app we would pass the actual transcript and metrics from the completed session
    const mockTranscript =
      "What is up guys, today I want to talk about the biggest mistake I see creators making when they start out on YouTube.";
    const mockMetrics = {
      score: 85,
      eyeContactPercentage: 90,
      smileDuration: 5,
      averageEnergy: 8,
      framingScore: 9,
      postureScore: 8,
      hookScore: 9,
      authenticityMoments: [],
    } as any;

    try {
      const generated = await captionEngine.generateCaptions({
        transcript: mockTranscript,
        metrics: mockMetrics,
        aesthetic,
        platform,
      });
      setResult(generated);
      setCustomHashtags(generated.hashtags);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View className="flex-1 bg-background-dark pt-12">
      <View className="flex-row items-center px-6 pb-4 border-b border-white/10">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text className="text-white font-display text-xl font-bold flex-1">Smart Captions</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {!result ? (
          <View className="space-y-8">
            <View>
              <Text className="text-white font-display text-lg font-bold mb-4">Vibe & Aesthetic</Text>
              <View className="flex-row gap-3">
                {["hype", "educational", "minimalist"].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setAesthetic(t as any)}
                    className={`px-4 py-3 rounded-xl border ${aesthetic === t ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10"}`}
                  >
                    <Text className={`font-display font-bold capitalize ${aesthetic === t ? "text-primary" : "text-gray-400"}`}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mt-8">
              <Text className="text-white font-display text-lg font-bold mb-4">Target Platform</Text>
              <View className="flex-row gap-3">
                {["tiktok", "reels", "shorts"].map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPlatform(p as any)}
                    className={`px-4 py-3 rounded-xl border flex-1 items-center ${platform === p ? "bg-accent/20 border-accent" : "bg-white/5 border-white/10"}`}
                  >
                    <Text
                      className={`font-display font-bold uppercase tracking-wider text-sm ${platform === p ? "text-accent" : "text-gray-400"}`}
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={isGenerating}
              className={`mt-12 flex-row items-center justify-center p-4 rounded-2xl ${isGenerating ? "bg-primary/50" : "bg-primary"}`}
            >
              <Wand2 color={isGenerating ? "#fff" : "#0a0a0a"} size={20} className="mr-2" />
              <Text className={`font-display font-bold text-lg ${isGenerating ? "text-white" : "text-background-dark"}`}>
                {isGenerating ? "Generating Magic..." : "Generate Captions"}
              </Text>
            </Pressable>

            <Text className="text-gray-500 font-sans text-center text-sm mt-4">
              Our AI analyzes your transcript, energy levels, and facial expressions to generate the perfect high-converting
              caption hook.
            </Text>
          </View>
        ) : (
          <View className="space-y-6">
            <View className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Type color="#0dccf2" size={16} className="mr-2" />
                  <Text className="text-primary font-display font-bold">Caption Variants</Text>
                </View>
                <Text className="text-gray-500 font-mono text-xs">{activeVariantIndex + 1} of 3</Text>
              </View>

              <Text className="text-white font-sans text-lg leading-relaxed mb-6">{result.variants[activeVariantIndex]}</Text>

              <View className="flex-row gap-2 justify-center">
                {[0, 1, 2].map((i) => (
                  <Pressable
                    key={i}
                    onPress={() => setActiveVariantIndex(i)}
                    className={`w-3 h-3 rounded-full ${activeVariantIndex === i ? "bg-primary" : "bg-white/20"}`}
                  />
                ))}
              </View>
            </View>

            <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-6">
              <View className="flex-row items-center mb-4">
                <Hash color="#f20db4" size={16} className="mr-2" />
                <Text className="text-accent font-display font-bold">Trending Tags</Text>
              </View>

              <TextInput
                value={customHashtags}
                onChangeText={setCustomHashtags}
                multiline
                className="text-gray-300 font-mono"
                placeholderTextColor="#666"
              />
            </View>

            <View className="flex-row gap-4 mt-8">
              <Pressable onPress={() => setResult(null)} className="flex-1 border border-white/20 py-4 rounded-2xl items-center">
                <Text className="text-white font-display font-bold">Regenerate</Text>
              </Pressable>
              <Pressable
                onPress={() => console.log("Copy/Save", result.variants[activeVariantIndex], customHashtags)}
                className="flex-1 bg-primary py-4 rounded-2xl items-center flex-row justify-center"
              >
                <Save color="#0a0a0a" size={18} className="mr-2" />
                <Text className="text-background-dark font-display font-bold">Save</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
