import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import {
  setupNotificationChannels,
  requestNotificationPermission,
  scheduleDailyMorningNotification,
} from "@/services/notifications";
import { getCalendarDay, getTodayString } from "@/data/festivals";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const NOTIF_INIT_KEY = "@whatstoday_notif_initialized";

async function initializeNotifications() {
  if (Platform.OS === "web") return;

  try {
    // 1. Set up Android channels
    await setupNotificationChannels();

    // 2. Check if we've already asked for permission
    const alreadyInitialized = await AsyncStorage.getItem(NOTIF_INIT_KEY);
    if (!alreadyInitialized) {
      // First launch — request permission
      const granted = await requestNotificationPermission();
      await AsyncStorage.setItem(NOTIF_INIT_KEY, "true");

      if (granted) {
        // Schedule daily 7AM notification
        const today = getTodayString();
        const day = getCalendarDay(today);
        const festivalName = day.festival ?? day.mainEvent;
        const tithiInfo = `${day.tithi} • ${day.paksha} Paksha`;
        await scheduleDailyMorningNotification(festivalName, tithiInfo);
      }
    } else {
      // Already initialized — re-schedule if permissions are granted
      const granted = await requestNotificationPermission();
      if (granted) {
        const today = getTodayString();
        const day = getCalendarDay(today);
        const festivalName = day.festival ?? day.mainEvent;
        const tithiInfo = `${day.tithi} • ${day.paksha} Paksha`;
        await scheduleDailyMorningNotification(festivalName, tithiInfo);
      }
    }
  } catch (err) {
    // Silently ignore notification errors — non-critical
    console.warn("[Notifications] Initialization failed:", err);
  }
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      // Initialize notifications after app is ready
      initializeNotifications();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </QueryClientProvider>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
