/**
 * Notification service for WhatsToday.
 * Handles scheduling daily morning notifications using Expo Notifications.
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleDailyMorningNotification(
  festivalName: string,
  message: string,
): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    // Cancel existing daily notifications first
    await cancelDailyNotifications();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🌅 ${festivalName || "WhatsToday"}`,
        body: message,
        sound: true,
        data: { type: "daily_morning" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Failed to schedule notification:", error);
    return null;
  }
}

export async function scheduleReminderNotification(
  title: string,
  body: string,
  hour: number,
  minute: number,
): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: { type: "reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
    return null;
  }
}

export async function cancelDailyNotifications(): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const dailyNotifs = scheduled.filter(
      (n) => n.content.data?.type === "daily_morning",
    );
    await Promise.all(
      dailyNotifs.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    );
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
  }
}

export async function cancelNotification(id: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.error("Failed to cancel notification:", error);
  }
}
