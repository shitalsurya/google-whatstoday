/**
 * UtilityCards — 2-column grid of high-value daily tiles.
 * Sunrise/Sunset, Moonrise/Moonset, Rahu Kaal, Abhijit Muhurat,
 * Brahma Muhurat, Festival Alert.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface UtilityTile {
  emoji: string;
  title: string;
  primary: string;
  secondary?: string;
  tone?: "default" | "warning" | "good" | "festival";
  onPress?: () => void;
}

const TONE_BG = {
  default: "#ffffff",
  warning: "#fff5e6",
  good: "#ecfdf5",
  festival: "#fff0f6",
};

const TONE_BORDER = {
  default: "#f0e9df",
  warning: "#fde0a8",
  good: "#bbf7d0",
  festival: "#fbcfe8",
};

interface UtilityCardsProps {
  tiles: UtilityTile[];
}

export function UtilityCards({ tiles }: UtilityCardsProps) {
  return (
    <View style={styles.grid}>
      {tiles.map((tile, i) => (
        <Pressable
          key={i}
          onPress={tile.onPress}
          style={({ pressed }) => [
            styles.tile,
            {
              backgroundColor: TONE_BG[tile.tone ?? "default"],
              borderColor: TONE_BORDER[tile.tone ?? "default"],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={styles.tileEmoji}>{tile.emoji}</Text>
          <Text style={styles.tileTitle} numberOfLines={1}>
            {tile.title}
          </Text>
          <Text style={styles.tilePrimary} numberOfLines={1}>
            {tile.primary}
          </Text>
          {tile.secondary ? (
            <Text style={styles.tileSecondary} numberOfLines={1}>
              {tile.secondary}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 2,
  },
  tileEmoji: { fontSize: 22, marginBottom: 4 },
  tileTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#7a6b5f",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tilePrimary: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    marginTop: 2,
  },
  tileSecondary: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#888888",
    marginTop: 1,
  },
});
