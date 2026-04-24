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
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WhatsNewModal } from "@/components/WhatsNewModal";
import { AppProvider, useApp } from "@/context/AppContext";
import {
  setupNotificationChannels,
  requestNotificationPermission,
  scheduleDailyMorningNotification,
} from "@/services/notifications";
import { getCalendarDay, getTodayString } from "@/data/festivals";
import {
  silentBackgroundCheck,
  reloadAppForUpdate,
  shouldShowWhatsNew,
  markWhatsNewSeen,
} from "@/services/updateService";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const NOTIF_INIT_KEY = "@whatstoday_notif_initialized";

async function initializeNotifications() {
  if (Platform.OS === "web") return;

  try {
    await setupNotificationChannels();

    const alreadyInitialized = await AsyncStorage.getItem(NOTIF_INIT_KEY);
    if (!alreadyInitialized) {
      const granted = await requestNotificationPermission();
      await AsyncStorage.setItem(NOTIF_INIT_KEY, "true");
      if (granted) {
        const today = getTodayString();
        const day = getCalendarDay(today);
        const festivalName = day.festival ?? day.mainEvent;
        const tithiInfo = `${day.tithi} • ${day.paksha} Paksha`;
        await scheduleDailyMorningNotification(festivalName, tithiInfo);
      }
    } else {
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
    console.warn("[Notifications] Initialization failed:", err);
  }
}

/**
 * Inner component that has access to AppContext (for language).
 * Mounts the WhatsNewModal and silently checks for OTA updates.
 */
function AppInner() {
  const { language } = useApp();
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. Whats New
      try {
        if (await shouldShowWhatsNew()) {
          if (!cancelled) setShowWhatsNew(true);
        }
      } catch {
        /* ignore */
      }

      // 2. Background OTA check
      try {
        const ready = await silentBackgroundCheck();
        if (ready && Platform.OS !== "web") {
          // Update downloaded — gentle prompt (non-blocking).
          // Skip the prompt if we're showing the What's New modal.
          if (!cancelled) {
            setTimeout(() => {
              Alert.alert(
                "Update ready",
                "New improvements available. Restart now?",
                [
                  { text: "Later", style: "cancel" },
                  { text: "Restart", onPress: () => reloadAppForUpdate() },
                ],
              );
            }, 1500);
          }
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCloseWhatsNew = async () => {
    setShowWhatsNew(false);
    await markWhatsNewSeen();
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <WhatsNewModal
        visible={showWhatsNew}
        onClose={handleCloseWhatsNew}
        language={language}
      />
    </>
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
              <AppInner />
            </GestureHandlerRootView>
          </QueryClientProvider>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
