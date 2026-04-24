/**
 * FestivalAlerts — shows today's festival, tomorrow's festival,
 * and the next upcoming major festival (within ~30 days).
 */

import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { calendarData, getCalendarDay, type CalendarDay } from "@/data/festivals";

interface FestivalAlertsProps {
  selectedDate: string;
  language: "en" | "mr" | "hi";
}

const LABELS = {
  en: {
    title: "Festival Alerts",
    today: "Today",
    tomorrow: "Tomorrow",
    coming: "Coming Soon",
    none: "No major festival nearby",
  },
  mr: {
    title: "सण सूचना",
    today: "आज",
    tomorrow: "उद्या",
    coming: "लवकरच",
    none: "जवळ कोणताही प्रमुख सण नाही",
  },
  hi: {
    title: "त्यौहार सूचना",
    today: "आज",
    tomorrow: "कल",
    coming: "जल्द आ रहा",
    none: "नज़दीक कोई प्रमुख त्यौहार नहीं",
  },
};

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function festivalName(d: CalendarDay, lang: "en" | "mr" | "hi"): string | null {
  const isMr = lang !== "en";
  return (
    (isMr ? d.festivalMr ?? d.mainEventMr : d.festival ?? d.mainEvent) ?? null
  );
}

export function FestivalAlerts({ selectedDate, language }: FestivalAlertsProps) {
  const L = LABELS[language];
  const tomorrow = addDays(selectedDate, 1);

  const todayDay = getCalendarDay(selectedDate);
  const tomorrowDay = getCalendarDay(tomorrow);

  const upcoming = useMemo(() => {
    // Next major festival in calendarData beyond `tomorrow`
    const startTime = new Date(tomorrow).getTime();
    const horizonTime = startTime + 30 * 86400000;
    return calendarData
      .filter((d) => {
        const t = new Date(d.date).getTime();
        return (
          t > startTime &&
          t <= horizonTime &&
          (d.festival || d.mainEvent) &&
          (d.festivalType === "major" || d.isHoliday)
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [tomorrow]);

  const items: { tag: string; emoji: string; name: string | null; tint: string }[] = [
    {
      tag: L.today,
      emoji: "🔔",
      name: festivalName(todayDay, language),
      tint: "#dc2626",
    },
    {
      tag: L.tomorrow,
      emoji: "🌙",
      name: festivalName(tomorrowDay, language),
      tint: "#0ea5e9",
    },
    {
      tag: L.coming,
      emoji: "📅",
      name: upcoming ? festivalName(upcoming, language) : null,
      tint: "#16a34a",
    },
  ];

  const hasAny = items.some((i) => i.name);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎊 {L.title}</Text>
      {hasAny ? (
        items
          .filter((i) => i.name)
          .map((item, i) => (
            <View key={i} style={styles.row}>
              <View style={[styles.tag, { backgroundColor: item.tint + "1a" }]}>
                <Text style={[styles.tagText, { color: item.tint }]}>
                  {item.emoji} {item.tag}
                </Text>
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          ))
      ) : (
        <Text style={styles.empty}>{L.none}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0e9df",
    gap: 10,
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#1a1a2e",
  },
  empty: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#888888",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 6,
  },
});
