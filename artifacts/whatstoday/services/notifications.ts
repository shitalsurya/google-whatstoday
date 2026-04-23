/**
 * Notification service for WhatsToday.
 * Fixed implementation with:
 * - Android notification channels
 * - Daily 7AM notification with today's festival
 * - Festival eve reminders
 * - First-launch permission request
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure global notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Android Channels ─────────────────────────────────────────────────────────

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    await Notifications.setNotificationChannelAsync("whatstoday-daily", {
      name: "Daily Morning Alert",
      description: "Daily 7 AM panchang and festival notification",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#e05c1a",
      sound: "default",
      enableVibrate: true,
      showBadge: false,
    });

    await Notifications.setNotificationChannelAsync("whatstoday-festival", {
      name: "Festival Reminders",
      description: "Eve-of-festival and upcoming festival reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: "#e05c1a",
      sound: "default",
      enableVibrate: true,
      showBadge: false,
    });
  } catch (err) {
    console.error("[Notifications] Failed to set up channels:", err);
  }
}

// ─── Permission ───────────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: true,
        allowCriticalAlerts: false,
        provideAppNotificationSettings: false,
      },
    });

    return status === "granted";
  } catch (err) {
    console.error("[Notifications] Permission request failed:", err);
    return false;
  }
}

// ─── Daily 7AM Notification ───────────────────────────────────────────────────

export async function scheduleDailyMorningNotification(
  festivalName: string | undefined,
  tithiInfo: string,
): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    await cancelNotificationsByType("daily_morning");
    const title = festivalName
      ? `📅 Today is ${festivalName}!`
      : "📅 Good Morning! Today's Importance";

   const body = festivalName
  ? `${tithiInfo} | WhatsToday`
  : `${tithiInfo} — Check WhatsToday`;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        data: { type: "daily_morning" },
        ...(Platform.OS === "android" ? { channelId: "whatstoday-daily" } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 7,
        minute: 0,
      },
    });

    return id;
  } catch (err) {
    console.error("[Notifications] Failed to schedule daily notification:", err);
    return null;
  }
}

// ─── Festival Eve Notification ────────────────────────────────────────────────

export async function scheduleFestivalEveNotification(
  festivalName: string,
  festivalDateStr: string,
): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    const festDate = new Date(festivalDateStr);
    const eveDate = new Date(festDate);
    eveDate.setDate(eveDate.getDate() - 1);
    eveDate.setHours(20, 0, 0, 0); // 8 PM eve reminder

    if (eveDate <= new Date()) return null; // Already past

    const id = await Notifications.scheduleNotificationAsync({
      content: {
       title: `🔔 Tomorrow is ${festivalName}!`,
        body: `Get ready for ${festivalName} tomorrow — Check WhatsToday`,
        sound: "default",
        data: { type: "festival_eve", festival: festivalName },
        ...(Platform.OS === "android" ? { channelId: "whatstoday-festival" } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: eveDate,
      },
    });

    return id;
  } catch (err) {
    console.error("[Notifications] Failed to schedule festival eve notification:", err);
    return null;
  }
}

// ─── Festival Day Alert ───────────────────────────────────────────────────────

export async function scheduleFestivalDayNotification(
  festivalName: string,
  festivalDateStr: string,
): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    const festDate = new Date(festivalDateStr);
    festDate.setHours(7, 0, 0, 0); // 7 AM on festival day

    if (festDate <= new Date()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🌸 आज ${festivalName} आहे!`,
        body: `WhatsToday उघडा आणि आजचे संपूर्ण पंचांग पहा 🙏`,
        sound: "default",
        data: { type: "festival_day", festival: festivalName },
        ...(Platform.OS === "android" ? { channelId: "whatstoday-festival" } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: festDate,
      },
    });

    return id;
  } catch (err) {
    console.error("[Notifications] Failed to schedule festival day notification:", err);
    return null;
  }
}

// ─── Cancel Helpers ───────────────────────────────────────────────────────────

export async function cancelNotificationsByType(type: string): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const matching = all.filter((n) => n.content.data?.type === type);
    await Promise.all(
      matching.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    );
  } catch (err) {
    console.error(`[Notifications] Failed to cancel ${type}:`, err);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.error("[Notifications] Failed to cancel all:", err);
  }
}

export async function cancelNotification(id: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (err) {
    console.error("[Notifications] Failed to cancel:", err);
  }
}

// Legacy compat
export { scheduleDailyMorningNotification as scheduleDailyNotification };
