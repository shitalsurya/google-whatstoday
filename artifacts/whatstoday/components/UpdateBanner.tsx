/**
 * UpdateBanner — appears at the top of the home screen when a downloaded
 * OTA update is ready. Tapping the CTA reloads the app to apply it.
 */

import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface UpdateBannerProps {
  visible: boolean;
  language: "en" | "mr" | "hi";
  onApply: () => void;
  onDismiss: () => void;
}

const LABELS = {
  en: {
    title: "New improvements available",
    subtitle: "Tap to restart and apply.",
    apply: "Restart",
  },
  mr: {
    title: "नवीन सुधारणा उपलब्ध",
    subtitle: "अद्ययावत करण्यासाठी टॅप करा.",
    apply: "रीस्टार्ट",
  },
  hi: {
    title: "नई सुधार उपलब्ध",
    subtitle: "लागू करने के लिए रीस्टार्ट करें.",
    apply: "रीस्टार्ट",
  },
};

export function UpdateBanner({
  visible,
  language,
  onApply,
  onDismiss,
}: UpdateBannerProps) {
  if (!visible) return null;
  const L = LABELS[language];
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Feather name="download-cloud" size={18} color="#15803d" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{L.title}</Text>
        <Text style={styles.subtitle}>{L.subtitle}</Text>
      </View>
      <Pressable onPress={onApply} style={styles.cta}>
        <Text style={styles.ctaText}>{L.apply}</Text>
      </Pressable>
      <Pressable onPress={onDismiss} style={styles.close} hitSlop={10}>
        <Feather name="x" size={16} color="#9ca3af" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderColor: "#86efac",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    marginHorizontal: 14,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#15803d" },
  subtitle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#16a34a",
    marginTop: 1,
  },
  cta: {
    backgroundColor: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  close: { padding: 2 },
});
