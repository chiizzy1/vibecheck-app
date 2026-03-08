// @ts-nocheck
import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Clapperboard, FileText, Clock, User } from "lucide-react-native";

function TabIcon({ icon: Icon, color, focused }: { icon: any; color: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
      {focused && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: color,
            marginTop: 4,
          }}
        />
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#0dccf2",
        tabBarInactiveTintColor: "#555",
        tabBarLabelStyle: {
          fontFamily: "SpaceGrotesk",
          fontSize: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Record",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Clapperboard} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scripts"
        options={{
          title: "Scripts",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={FileText} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Clock} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={User} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
