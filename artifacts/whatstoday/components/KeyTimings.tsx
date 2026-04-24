/**
 * KeyTimings — detailed list view of today's astronomical/muhurat timings.
 * Mirrors the data displayed in the utility tiles but in a longer table-style format.
 */

import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { KeyTimings as KeyTimingsData } from "@/utils/panchangUtils";

interface KeyTimingsProps {
  timings: KeyTimingsData;
  language: "en" | "mr" | "hi";
}

const LABELS = {
  en: {
    title: "Today's Key Timings",
    sunrise: "Sunrise",
    sunset: "Sunset",
    moonrise: "Moonrise",
    moonset: "Moonset",
    rahu: "Rahu Kaal",
    brahma: "Brahma Muhurat",
    abhijit: "Abhijit Muhurat",
  },
  mr: {
    title: "आजच्या मुख्य वेळा",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    moonrise: "चंद्रोदय",
    moonset: "चंद्रास्त",
    rahu: "राहू काळ",
    brahma: "ब्रह्म मुहूर्त",
    abhijit: "अभिजित मुहूर्त",
  },
  hi: {
    title: "आज के मुख्य समय",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    moonrise: "चंद्रोदय",
    moonset: "चंद्रास्त",
    rahu: "राहु काल",
    brahma: "ब्रह्म मुहूर्त",
    abhijit: "अभिजीत मुहूर्त",
  },
};

export function KeyTimings({ timings, language }: KeyTimingsProps) {
  const L = LABELS[language];
  const rows: { icon: any; tint: string; label: string; value: string }[] = [
    { icon: "sunrise", tint: "#f59e0b", label: L.sunrise, value: timings.sunrise },
    { icon: "sunset", tint: "#ef4444", label: L.sunset, value: timings.sunset },
    { icon: "moon", tint: "#6366f1", label: L.moonrise, value: timings.moonrise },
    { icon: "moon", tint: "#0ea5e9", label: L.moonset, value: timings.moonset },
    {
      icon: "alert-triangle",
      tint: "#dc2626",
      label: L.rahu,
      value: `${timings.rahuKaal.start} – ${timings.rahuKaal.end}`,
    },
    {
      icon: "feather",
      tint: "#8b5cf6",
      label: L.brahma,
      value: `${timings.brahmaMuhurat.start} – ${timings.brahmaMuhurat.end}`,
    },
    {
      icon: "star",
      tint: "#16a34a",
      label: L.abhijit,
      value: `${timings.abhijitMuhurat.start} – ${timings.abhijitMuhurat.end}`,
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{L.title}</Text>
      {rows.map((r, i) => (
        <View
          key={i}
          style={[
            styles.row,
            { borderBottomWidth: i === rows.length - 1 ? 0 : 1 },
          ]}
        >
          <View style={[styles.iconBg, { backgroundColor: r.tint + "1a" }]}>
            <Feather name={r.icon} size={14} color={r.tint} />
          </View>
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.value}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f0e9df",
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    paddingVertical: 8,
    paddingHorizontal: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderBottomColor: "#f5f0eb",
    gap: 10,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#3a3a4a",
  },
  value: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
  },
});
