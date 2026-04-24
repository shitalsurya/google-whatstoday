/**
 * QuickChips — horizontal row of Tithi / Nakshatra / Yoga / Karana
 * shown directly under the home header. Tappable to surface details.
 */

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface ChipData {
  label: string;
  value: string;
  emoji: string;
}

interface QuickChipsProps {
  chips: ChipData[];
  onPressChip?: (chip: ChipData) => void;
}

export function QuickChips({ chips, onPressChip }: QuickChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {chips.map((chip, i) => (
        <Pressable
          key={i}
          onPress={() => onPressChip?.(chip)}
          style={({ pressed }) => [
            styles.chip,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.chipEmoji}>{chip.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.chipLabel}>{chip.label}</Text>
            <Text style={styles.chipValue} numberOfLines={1}>
              {chip.value}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    minWidth: 130,
  },
  chipEmoji: { fontSize: 18 },
  chipLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipValue: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginTop: 1,
  },
});
