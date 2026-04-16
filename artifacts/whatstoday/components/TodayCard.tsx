/**
 * TodayCard: The main shareable card showing festival, tithi, nakshatra.
 * Styled as a beautiful Indian-themed card, suitable for sharing.
 */

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";
import { CalendarDay, formatDisplayDate } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";

interface TodayCardProps {
  day: CalendarDay;
  cardRef?: React.RefObject<View>;
}

export function TodayCard({ day, cardRef }: TodayCardProps) {
  const colors = useColors();
  const { language } = useApp();
  const isMr = language === "mr";

  const festivalName = isMr ? day.festivalMr : day.festival;
  const tithiText = isMr ? day.tithiMr : day.tithi;
  const nakshatraText = isMr ? day.nakshtraMr : day.nakshatra;
  const vaarText = isMr ? day.vaarMr : day.vaar;
  const pakshaText = isMr ? day.pakshaMr : day.paksha;
  const displayDate = formatDisplayDate(day.date, language);

  const festivalTypeColors = {
    major: { bg: "#fff0f2", text: "#8b1a2a", border: "#f5c0ca" },
    minor: { bg: "#fff8e8", text: "#7a5a00", border: "#f5e0a0" },
    holiday: { bg: "#e8f5e9", text: "#1a5a2a", border: "#a0d8a0" },
  };

  const festivalColors = day.festivalType
    ? festivalTypeColors[day.festivalType]
    : { bg: colors.secondary, text: colors.secondaryForeground, border: colors.border };

  return (
    <View
      ref={cardRef}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      {/* Top Header — Orange gradient band */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerVaar}>{vaarText}</Text>
          <Text style={styles.headerDate}>{displayDate}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.appName}>WhatsToday</Text>
          <Feather name="calendar" size={18} color="rgba(255,255,255,0.8)" />
        </View>
      </View>

      {/* Panchang row */}
      <View style={[styles.panchangRow, { borderBottomColor: colors.border }]}>
        <View style={[styles.panchangChip, { backgroundColor: colors.infoBackground }]}>
          <MaterialCommunityIcons name="moon-waning-crescent" size={13} color={colors.infoColor} />
          <Text style={[styles.panchangChipText, { color: colors.infoColor }]}>
            {pakshaText} {isMr ? "पक्ष" : "Paksha"}
          </Text>
        </View>
        <View style={[styles.panchangChip, { backgroundColor: colors.infoBackground }]}>
          <Feather name="sun" size={13} color={colors.infoColor} />
          <Text style={[styles.panchangChipText, { color: colors.infoColor }]}>
            {tithiText} {isMr ? "तिथी" : "Tithi"}
          </Text>
        </View>
        <View style={[styles.panchangChip, { backgroundColor: colors.infoBackground }]}>
          <MaterialCommunityIcons name="star-four-points" size={13} color={colors.infoColor} />
          <Text style={[styles.panchangChipText, { color: colors.infoColor }]}>
            {nakshatraText}
          </Text>
        </View>
      </View>

      {/* Festival Section */}
      {festivalName ? (
        <View
          style={[
            styles.festivalSection,
            {
              backgroundColor: festivalColors.bg,
              borderColor: festivalColors.border,
            },
          ]}
        >
          <View style={styles.festivalIconRow}>
            <MaterialCommunityIcons
              name="flower-tulip"
              size={22}
              color={festivalColors.text}
            />
            <Text style={[styles.festivalLabel, { color: colors.mutedForeground }]}>
              {isMr ? "आजचा सण" : "Today's Festival"}
            </Text>
          </View>
          <Text style={[styles.festivalName, { color: festivalColors.text }]}>
            {festivalName}
          </Text>
          {day.festivalType === "major" && (
            <View style={[styles.majorBadge, { backgroundColor: festivalColors.text }]}>
              <Text style={styles.majorBadgeText}>
                {isMr ? "मुख्य सण" : "Major Festival"}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.noFestivalSection, { backgroundColor: colors.muted }]}>
          <Feather name="calendar" size={20} color={colors.mutedForeground} />
          <Text style={[styles.noFestivalText, { color: colors.mutedForeground }]}>
            {isMr ? "आज विशेष सण नाही" : "No special festival today"}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Motivational Quote */}
      <View style={styles.quoteSection}>
        <Feather name="feather" size={14} color={colors.accent} style={styles.quoteIcon} />
        <Text style={[styles.quoteText, { color: colors.mutedForeground }]}>
          {isMr ? day.quoteMr : day.quote}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
    marginHorizontal: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  headerVaar: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headerDate: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  appName: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  panchangRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexWrap: "wrap",
    borderBottomWidth: 1,
  },
  panchangChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  panchangChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  festivalSection: {
    margin: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  festivalIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  festivalLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  festivalName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
  },
  majorBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  majorBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  noFestivalSection: {
    margin: 16,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  noFestivalText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  quoteSection: {
    padding: 16,
    paddingTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  quoteIcon: {
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    lineHeight: 20,
  },
});
