// @ts-nocheck
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "@/src/tw";
import { useRouter } from "expo-router";
import { Sparkles, ArrowRight, Play, ChevronLeft } from "lucide-react-native";
import { useUserStore } from "@/src/stores/user-store";
import { useSessionStore } from "@/src/stores/session-store";
import { type Script, type ContentType } from "@/src/types/session";

const CONTENT_TYPES: { id: ContentType; icon: string; label: string }[] = [
  { id: "storytime", icon: "📖", label: "Storytime" },
  { id: "grwm", icon: "💄", label: "GRWM" },
  { id: "tutorial", icon: "🎓", label: "Tutorial" },
  { id: "reaction", icon: "😱", label: "Reaction" },
  { id: "vlog", icon: "📹", label: "Vlog" },
];

export default function ScriptGeneratorScreen() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType>("storytime");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<Script | null>(null);

  const { saveScript } = useUserStore();
  const { setActiveScript } = useSessionStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      // MOCK: In a real app, this calls a Supabase Edge Function that hits Gemini
      // with a prompt structured to return a hook, body, and CTA.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult: Script = {
        id: Date.now().toString(),
        topic,
        content: `**Listen up** because I wish someone told me this sooner.\n\nWhen you're trying to build an audience, the biggest mistake is overthinking the production value instead of focusing on the actual *hook*.\n\nHere are the three things I changed that doubled my engagement:\n\n1. I stopped doing long intros.\n2. I started keeping solid eye contact.\n3. I made sure my energy matched the severity of the topic.\n\n**If you found this helpful**, drop a ⚡ emoji in the comments and hit follow!`,
        estimatedDuration: 45,
        type: selectedType,
        createdAt: Date.now(),
      };

      setGeneratedScript(mockResult);
      saveScript(mockResult);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseScript = () => {
    if (generatedScript) {
      setActiveScript(generatedScript);
      router.push("/session");
    }
  };

  return (
    <View className="flex-1 bg-background-dark pt-12">
      {/* Header */}
      <View className="flex-row items-center px-6 pb-4 border-b border-white/10">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text className="text-white font-display text-xl font-bold flex-1">Script Generator</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {!generatedScript ? (
          <>
            <View className="mb-8">
              <Text className="text-white text-lg font-display mb-2">What's the video about?</Text>
              <TextInput
                className="bg-white/5 text-white p-4 rounded-2xl border border-white/10 font-sans text-lg h-32"
                placeholder="E.g., 3 tips for better eye contact on camera..."
                placeholderTextColor="#666"
                multiline
                textAlignVertical="top"
                value={topic}
                onChangeText={setTopic}
              />
            </View>

            <View className="mb-10">
              <Text className="text-white text-lg font-display mb-4">Content Type</Text>
              <View className="flex-row flex-wrap gap-3">
                {CONTENT_TYPES.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    className={`flex-row items-center px-4 py-3 rounded-full border ${
                      selectedType === type.id ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <Text className="text-xl mr-2">{type.icon}</Text>
                    <Text className={`font-semibold ${selectedType === type.id ? "text-primary" : "text-gray-400"}`}>
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className={`flex-row items-center justify-center p-4 rounded-full ${
                isGenerating || !topic.trim() ? "bg-primary/50" : "bg-primary"
              }`}
            >
              {isGenerating ? (
                <Text className="text-background-dark font-bold text-lg font-display">Generating Magic...</Text>
              ) : (
                <>
                  <Sparkles color="#081113" size={20} className="mr-2" />
                  <Text className="text-background-dark font-bold text-lg font-display">Generate Script</Text>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-primary font-bold font-display uppercase tracking-widest text-sm">Generated Script</Text>
              <Text className="text-gray-400 font-mono text-sm">~{generatedScript.estimatedDuration}s</Text>
            </View>

            <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
              <Text className="text-white text-lg leading-relaxed font-sans">{generatedScript.content}</Text>
            </View>

            <View className="flex-row justify-between items-center gap-4">
              <Pressable
                onPress={() => setGeneratedScript(null)}
                className="flex-1 py-4 border border-white/20 rounded-full items-center"
              >
                <Text className="text-white font-bold font-display">Start Over</Text>
              </Pressable>

              <Pressable
                onPress={handleUseScript}
                className="flex-1 py-4 bg-primary rounded-full flex-row justify-center items-center"
              >
                <Text className="text-background-dark font-bold font-display mr-2">Send to Camera</Text>
                <ArrowRight color="#081113" size={18} />
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
