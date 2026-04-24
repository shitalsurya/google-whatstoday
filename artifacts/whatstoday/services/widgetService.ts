/**
 * Widget Service — prepares & persists widget content.
 *
 * The actual native Android widget reads this content from a known
 * shared-preferences key (see `plugins/withWhatsTodayWidget` and
 * `android/.../WhatsTodayWidgetProvider.kt` after running `expo prebuild`).
 *
 * On platforms without a widget (iOS, web, Expo Go), this service
 * simply caches the latest widget snapshot in AsyncStorage so the data
 * is ready when the native widget is later activated.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const WIDGET_DATA_KEY = "@whatstoday_widget_data";
const WIDGET_AUTO_REFRESH_KEY = "@whatstoday_widget_autorefresh";

export interface WidgetSnapshot {
  date: string; // YYYY-MM-DD
  displayDate: string; // "24 April, Friday"
  festival: string | null;
  national: string | null;
  insight: string;
  language: "en" | "mr" | "hi";
  generatedAt: number;
}

/**
 * Generate a widget snapshot from a CalendarDay and persist it.
 * Native Android widget code reads this on its next refresh tick.
 */
export async function updateWidgetData(snapshot: WidgetSnapshot): Promise<void> {
  try {
    await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(snapshot));
    if (Platform.OS === "android") {
      // Best-effort native bridge — only present after `expo prebuild`
      // installs the WhatsTodayWidget module. Safe to ignore if absent.
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { NativeModules } = require("react-native");
        const Bridge = NativeModules?.WhatsTodayWidget;
        if (Bridge?.updateWidget) {
          await Bridge.updateWidget(JSON.stringify(snapshot));
        }
      } catch {
        /* widget module not installed in this build — fine */
      }
    }
  } catch {
    /* ignore — widget is non-critical */
  }
}

export async function getWidgetData(): Promise<WidgetSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setWidgetAutoRefresh(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(WIDGET_AUTO_REFRESH_KEY, enabled ? "true" : "false");
}

export async function getWidgetAutoRefresh(): Promise<boolean> {
  const v = await AsyncStorage.getItem(WIDGET_AUTO_REFRESH_KEY);
  return v !== "false"; // default ON
}
