/**
 * ShareCard: Beautiful gradient card for sharing today's panchang info.
 * Captured with react-native-view-shot and shared via expo-sharing.
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { CalendarDay, getMarathiMonth } from "@/data/festivals";

interface ShareCardProps {
  day: CalendarDay;
  language: "en" | "mr" | "hi";
}

export function ShareCard({ day, language }: ShareCardProps) {
  const isMr = language !== "en";
  const mm = getMarathiMonth(day.date);

  const date = new Date(day.date);
  const dateLabel = date.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const weekday = isMr ? day.vaarMr : day.vaar;

  const festival = isMr ? (day.festivalMr ?? day.mainEventMr) : (day.festival ?? day.mainEvent);
  const tithiLabel = isMr
    ? `${day.tithiMr} • ${day.pakshaMr} पक्ष`
    : `${day.tithi} • ${day.paksha} Paksha`;
  const marathiMonthLabel = isMr ? mm.nameMr : mm.name;
  const quote = isMr ? day.historyFactMr : day.historyFact;

  return (
    <LinearGradient
     colors={["#4285F4", "#34A853", "#FBBC05", "#EA4335"]}
     // colors={["#c0392b", "#e05c1a", "#f5a623"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Om Symbol / branding top */}
      <View style={styles.topRow}>
         <Image source={require('@/assets/images/smallicon.png')}
          style={{ width: 60, height: 60 }}
        />
        <Text style={styles.brandName}>WhatsToday</Text>
        <Text style={styles.subBrand}>{isMr ? "स्मार्ट कैलेंडर" : "Smart Calendar"}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Date block */}
      <View style={styles.dateBlock}>
        <Text style={styles.dateBig}>{dateLabel}</Text>
        <Text style={styles.dateDay}>{weekday}</Text>
        <View style={styles.panchangRow}>
          <PanchangChip label={marathiMonthLabel} />
          <PanchangChip label={tithiLabel} />
          <PanchangChip label={isMr ? day.nakshtraMr : day.nakshatra} />
        </View>
      </View>

   {/* Festival */}
{festival && (
  <View>
  <View style={styles.festivalBlock}>
    <View style={styles.festivalLine} />

    <Text style={styles.festivalName}>
      🎉 {festival}
    </Text>

    <View style={styles.festivalLine} />
  </View>


      {/* Quote */}
      <View style={styles.quoteBlock}>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </View>
      
  </View>
)}
      {/* Bottom branding */}
      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Shared from WhatsToday • {isMr ? "नेक्स्ट-जन स्मार्ट दिनदर्शिका" : "Next-Gen Smart Calendar"}</Text>
      </View>
    </LinearGradient>
  );
}

function PanchangChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    borderRadius: 20,
    padding: 24,
    gap: 14,
  },
  topRow: {
    alignItems: "center",
    gap: 2,
  },
  omSymbol: {
    fontSize: 32,
  },
  brandName: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  subBrand: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dateBlock: {
    alignItems: "center",
    gap: 6,
  },
  dateBig: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  dateDay: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  panchangRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 4,
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  chipText: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  festivalBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  festivalLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  festivalName: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    flexShrink: 1,
  },
  noFestivalText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    flexShrink: 1,
  },
  quoteBlock: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 14,
  },
  quoteText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomRow: {
    alignItems: "center",
    paddingTop: 4,
  },
  bottomText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
