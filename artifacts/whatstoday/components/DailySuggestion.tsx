/**
 * DailySuggestion — "Good for / Avoid" guidance card.
 * Items rotate based on the auspicious level of the day so the user
 * gets practical, contextual advice.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { AuspiciousLevel } from "@/utils/panchangUtils";

interface DailySuggestionProps {
  level: AuspiciousLevel;
  language: "en" | "mr" | "hi";
}

const SUGGESTIONS = {
  shubh: {
    en: {
      good: ["Work start", "Pooja", "Study", "Travel", "New beginnings"],
      avoid: ["Conflict", "Anger"],
    },
    mr: {
      good: ["कामाची सुरुवात", "पूजा", "अभ्यास", "प्रवास", "नवीन सुरुवात"],
      avoid: ["वाद", "राग"],
    },
    hi: {
      good: ["काम की शुरुआत", "पूजा", "पढ़ाई", "यात्रा", "नई शुरुआत"],
      avoid: ["विवाद", "क्रोध"],
    },
  },
  samanya: {
    en: {
      good: ["Routine work", "Meetings", "Self-study"],
      avoid: ["Major purchases"],
    },
    mr: {
      good: ["नित्य कार्य", "बैठका", "स्व-अभ्यास"],
      avoid: ["मोठ्या खरेदी"],
    },
    hi: {
      good: ["रूटीन काम", "मीटिंग्स", "स्व-अध्ययन"],
      avoid: ["बड़ी खरीदारी"],
    },
  },
  savdhan: {
    en: {
      good: ["Meditation", "Quiet study"],
      avoid: ["Major purchases", "Long travel", "New ventures"],
    },
    mr: {
      good: ["ध्यान", "शांत अभ्यास"],
      avoid: ["मोठ्या खरेदी", "लांब प्रवास", "नवीन उपक्रम"],
    },
    hi: {
      good: ["ध्यान", "शांत अध्ययन"],
      avoid: ["बड़ी खरीदारी", "लंबी यात्रा", "नए उपक्रम"],
    },
  },
};

const LABELS = {
  en: { title: "Daily Suggestion", good: "Good for", avoid: "Avoid" },
  mr: { title: "दैनिक सूचना", good: "योग्य", avoid: "टाळावे" },
  hi: { title: "दैनिक सुझाव", good: "उपयुक्त", avoid: "बचें" },
};

export function DailySuggestion({ level, language }: DailySuggestionProps) {
  const L = LABELS[language];
  const data = SUGGESTIONS[level][language];
  return (
    <View style={styles.card}>
      <Text style={styles.title}>💡 {L.title}</Text>

      <View style={styles.section}>
        <View style={[styles.tag, { backgroundColor: "#dcfce7" }]}>
          <Text style={[styles.tagText, { color: "#15803d" }]}>✅ {L.good}</Text>
        </View>
        <View style={styles.itemList}>
          {data.good.map((g, i) => (
            <View key={i} style={[styles.pill, { backgroundColor: "#f0fdf4", borderColor: "#86efac" }]}>
              <Text style={[styles.pillText, { color: "#15803d" }]}>{g}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={[styles.tag, { backgroundColor: "#fee2e2" }]}>
          <Text style={[styles.tagText, { color: "#b91c1c" }]}>⛔ {L.avoid}</Text>
        </View>
        <View style={styles.itemList}>
          {data.avoid.map((a, i) => (
            <View key={i} style={[styles.pill, { backgroundColor: "#fef2f2", borderColor: "#fca5a5" }]}>
              <Text style={[styles.pillText, { color: "#b91c1c" }]}>{a}</Text>
            </View>
          ))}
        </View>
      </View>
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
    gap: 12,
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: { gap: 8 },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  itemList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
});
