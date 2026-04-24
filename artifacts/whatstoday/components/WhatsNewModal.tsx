/**
 * WhatsNewModal — shown after an OTA / version update so users
 * discover the latest features.
 */

import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { VERSION_CONFIG } from "@/constants/versionConfig";

interface WhatsNewModalProps {
  visible: boolean;
  onClose: () => void;
  language: "en" | "mr" | "hi";
}

const LABELS = {
  en: { title: "What's New", subtitle: "Version", continue: "Continue" },
  mr: { title: "नवीन काय आहे?", subtitle: "आवृत्ती", continue: "पुढे जा" },
  hi: { title: "नया क्या है?", subtitle: "वर्ज़न", continue: "आगे बढ़ें" },
};

export function WhatsNewModal({ visible, onClose, language }: WhatsNewModalProps) {
  const L = LABELS[language];
  const items =
    VERSION_CONFIG.whatsNew[VERSION_CONFIG.currentVersion]?.[language] ??
    VERSION_CONFIG.whatsNew[VERSION_CONFIG.currentVersion]?.en ??
    [];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.emojiCircle}>
              <Text style={{ fontSize: 28 }}>🎉</Text>
            </View>
            <Text style={styles.title}>{L.title}</Text>
            <Text style={styles.subtitle}>
              {L.subtitle} {VERSION_CONFIG.currentVersion}
            </Text>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {items.map((it, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemText}>{it}</Text>
              </View>
            ))}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.cta}>
            <Text style={styles.ctaText}>{L.continue}</Text>
            <Feather name="arrow-right" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  header: { alignItems: "center", paddingVertical: 12, gap: 6 },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#1a1a2e" },
  subtitle: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#888888" },
  scroll: { marginVertical: 14, maxHeight: 320 },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 6,
  },
  itemText: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#3a3a4a", lineHeight: 21 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e05c1a",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  ctaText: { color: "#ffffff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
