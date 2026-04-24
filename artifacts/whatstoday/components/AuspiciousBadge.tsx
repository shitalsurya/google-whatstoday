/**
 * AuspiciousBadge — green / yellow / red pill summarising the day's
 * auspicious quality.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  AUSPICIOUS_LABELS,
  type AuspiciousLevel,
} from "@/utils/panchangUtils";

interface AuspiciousBadgeProps {
  level: AuspiciousLevel;
  language: "en" | "mr" | "hi";
}

const COLOR = {
  shubh: { bg: "#ecfdf5", border: "#86efac", fg: "#15803d", emoji: "🟢" },
  samanya: { bg: "#fefce8", border: "#fde047", fg: "#a16207", emoji: "🟡" },
  savdhan: { bg: "#fef2f2", border: "#fca5a5", fg: "#b91c1c", emoji: "🔴" },
};

export function AuspiciousBadge({ level, language }: AuspiciousBadgeProps) {
  const c = COLOR[level];
  const label = AUSPICIOUS_LABELS[level][language];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: c.bg, borderColor: c.border },
      ]}
    >
      <Text style={styles.emoji}>{c.emoji}</Text>
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "center",
  },
  emoji: { fontSize: 14 },
  text: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
});
