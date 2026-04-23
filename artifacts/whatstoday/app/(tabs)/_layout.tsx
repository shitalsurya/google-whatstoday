import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DARK_BG = "#0f0f1a";
const DARK_BORDER = "#2a2a3a";
const ACTIVE_TINT = "#f5a623";
const INACTIVE_TINT = "#888888";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="calendar">
        {/* <Icon sf={{ default: "calendar", selected: "calendar.fill" }} /> */}
        <Label>Calender</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "questionmark.square", selected: "questionmark.square.fill" }} />
        <Label>What's Today</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_TINT,
        tabBarInactiveTintColor: INACTIVE_TINT,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: DARK_BG,
          borderTopWidth: 1,
          borderTopColor: DARK_BORDER,
          elevation: 0,
          height: 60 + insets.bottom,
           paddingBottom: insets.bottom,
        },
        tabBarBackground: () =>
          isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: DARK_BG }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calender",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="calendar" tintColor={color} size={22} />
            ) : (
              <Feather name="calendar" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "What's Today",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="questionmark.square" tintColor={color} size={22} />
            ) : (
              <MaterialCommunityIcons name="calendar-question" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
