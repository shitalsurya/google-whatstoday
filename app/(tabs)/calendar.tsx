/**
 * Calendar Month View screen — shows a full month grid with festival indicators.
 * Tap any date to see its details in a bottom card.
 */

import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { getCalendarDay, calendarData, formatDisplayDate } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_MR = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_MR = [
  "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून",
  "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर",
];

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function hasFestival(dateStr: string) {
  return calendarData.find((d) => d.date === dateStr && d.festival);
}

function getFestivalType(dateStr: string) {
  const entry = calendarData.find((d) => d.date === dateStr && d.festival);
  return entry?.festivalType ?? null;
}

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  language: "en" | "mr";
}

function CalendarGrid({ year, month, selectedDate, onSelectDate, language }: CalendarGridProps) {
  const colors = useColors();
  const today = getTodayString();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete rows
  while (cells.length % 7 !== 0) cells.push(null);

  const dayLabels = language === "mr" ? DAYS_MR : DAYS_EN;

  return (
    <View style={styles.grid}>
      {/* Day headers */}
      <View style={styles.dayHeaderRow}>
        {dayLabels.map((d, i) => (
          <View key={i} style={styles.dayHeaderCell}>
            <Text
              style={[
                styles.dayHeaderText,
                {
                  color: i === 0 ? "#e05c1a" : colors.mutedForeground,
                },
              ]}
            >
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Date cells */}
      {Array.from({ length: cells.length / 7 }, (_, rowIdx) => (
        <View key={rowIdx} style={styles.weekRow}>
          {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
            if (!day) {
              return <View key={colIdx} style={styles.dayCell} />;
            }

            const ds = dateString(year, month, day);
            const isSelected = ds === selectedDate;
            const isToday = ds === today;
            const festType = getFestivalType(ds);
            const isSunday = colIdx === 0;

            return (
              <Pressable
                key={colIdx}
                onPress={() => {
                  onSelectDate(ds);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.dayCell,
                  isSelected && {
                    backgroundColor: colors.primary,
                    borderRadius: 12,
                  },
                  isToday && !isSelected && {
                    borderWidth: 2,
                    borderColor: colors.primary,
                    borderRadius: 12,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: isSelected
                        ? "#ffffff"
                        : isToday
                        ? colors.primary
                        : isSunday
                        ? "#e05c1a"
                        : colors.foreground,
                      fontFamily: isSelected || isToday
                        ? "Inter_700Bold"
                        : "Inter_400Regular",
                    },
                  ]}
                >
                  {day}
                </Text>
                {/* Festival dot */}
                {festType && (
                  <View
                    style={[
                      styles.festDot,
                      {
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.9)"
                          : festType === "major"
                          ? "#8b1a2a"
                          : "#f5a623",
                      },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default function CalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setSelectedDate } = useApp();
  const isMr = language === "mr";

  const today = getTodayString();
  const todayDate = new Date(today);

  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());
  const [selectedDate, setLocalSelected] = useState(today);

  const selectedDay = useMemo(() => getCalendarDay(selectedDate), [selectedDate]);

  const monthLabel = isMr ? MONTHS_MR[viewMonth] : MONTHS_EN[viewMonth];

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const goToToday = useCallback(() => {
    setViewYear(todayDate.getFullYear());
    setViewMonth(todayDate.getMonth());
    setLocalSelected(today);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [today, todayDate]);

  const handleSelectDate = useCallback((date: string) => {
    setLocalSelected(date);
    setSelectedDate(date);
  }, [setSelectedDate]);

  // Collect festivals for current month
  const monthFestivals = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`;
    return calendarData.filter((d) => d.date.startsWith(prefix) && d.festival);
  }, [viewYear, viewMonth]);

  const festivalName = isMr ? selectedDay.festivalMr : selectedDay.festival;
  const tithiText = isMr ? selectedDay.tithiMr : selectedDay.tithi;
  const nakshatraText = isMr ? selectedDay.nakshtraMr : selectedDay.nakshatra;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + (Platform.OS === "web" ? 10 : 8),
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.monthNav}>
            <Pressable onPress={prevMonth} style={styles.navBtn}>
              <Feather name="chevron-left" size={22} color="#ffffff" />
            </Pressable>
            <Text style={styles.monthTitle}>
              {monthLabel} {viewYear}
            </Text>
            <Pressable onPress={nextMonth} style={styles.navBtn}>
              <Feather name="chevron-right" size={22} color="#ffffff" />
            </Pressable>
          </View>
          <Pressable onPress={goToToday} style={styles.todayBtn}>
            <MaterialCommunityIcons name="calendar-today" size={16} color="#ffffff" />
            <Text style={styles.todayBtnText}>{isMr ? "आज" : "Today"}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) },
        ]}
      >
        {/* Calendar Grid */}
        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            language={language}
          />

          {/* Legend */}
          <View style={[styles.legend, { borderTopColor: colors.border }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#8b1a2a" }]} />
              <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
                {isMr ? "मुख्य सण" : "Major Festival"}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#f5a623" }]} />
              <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
                {isMr ? "किरकोळ सण" : "Minor Festival"}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Date Detail Card */}
        <View
          style={[
            styles.detailCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.detailHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailDate, { color: colors.foreground }]}>
              {formatDisplayDate(selectedDate, language)}
            </Text>
            <Text style={[styles.detailVaar, { color: colors.primary }]}>
              {isMr ? selectedDay.vaarMr : selectedDay.vaar}
            </Text>
          </View>

          <View style={styles.detailChips}>
            <View style={[styles.chip, { backgroundColor: colors.infoBackground }]}>
              <MaterialCommunityIcons name="moon-waning-crescent" size={13} color={colors.infoColor} />
              <Text style={[styles.chipText, { color: colors.infoColor }]}>
                {tithiText}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.infoBackground }]}>
              <MaterialCommunityIcons name="star-four-points" size={13} color={colors.infoColor} />
              <Text style={[styles.chipText, { color: colors.infoColor }]}>
                {nakshatraText}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.infoBackground }]}>
              <Feather name="sun" size={13} color={colors.infoColor} />
              <Text style={[styles.chipText, { color: colors.infoColor }]}>
                {isMr ? selectedDay.pakshaMr : selectedDay.paksha} {isMr ? "पक्ष" : "Paksha"}
              </Text>
            </View>
          </View>

          {festivalName ? (
            <View style={[styles.festivalBanner, { backgroundColor: colors.festivalBackground, borderColor: "#f5c0ca" }]}>
              <MaterialCommunityIcons name="flower-tulip" size={18} color={colors.festivalColor} />
              <Text style={[styles.festivalBannerText, { color: colors.festivalColor }]}>
                {festivalName}
              </Text>
              {selectedDay.festivalType === "major" && (
                <View style={[styles.majorTag, { backgroundColor: colors.festivalColor }]}>
                  <Text style={styles.majorTagText}>{isMr ? "मुख्य" : "Major"}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={[styles.noFestivalText, { color: colors.mutedForeground }]}>
              {isMr ? "आज विशेष सण नाही" : "No special festival today"}
            </Text>
          )}
        </View>

        {/* Month's Festivals List */}
        {monthFestivals.length > 0 && (
          <View
            style={[
              styles.festivalListCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {isMr
                ? `${monthLabel} ${viewYear} चे सण`
                : `Festivals in ${monthLabel} ${viewYear}`}
            </Text>
            {monthFestivals.map((f, i) => {
              const dayDate = new Date(f.date);
              const dayNum = dayDate.getDate();
              const dayName = isMr
                ? DAYS_MR[dayDate.getDay()]
                : DAYS_EN[dayDate.getDay()];
              const name = isMr ? f.festivalMr : f.festival;
              const isLast = i === monthFestivals.length - 1;

              return (
                <Pressable
                  key={f.date}
                  onPress={() => handleSelectDate(f.date)}
                  style={[
                    styles.festivalListItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: isLast ? 0 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.festDateBadge,
                      {
                        backgroundColor:
                          f.festivalType === "major"
                            ? colors.festivalBackground
                            : colors.secondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.festDateNum,
                        {
                          color:
                            f.festivalType === "major"
                              ? colors.festivalColor
                              : colors.primary,
                        },
                      ]}
                    >
                      {dayNum}
                    </Text>
                    <Text
                      style={[
                        styles.festDateDay,
                        {
                          color:
                            f.festivalType === "major"
                              ? colors.festivalColor
                              : colors.primary,
                        },
                      ]}
                    >
                      {dayName}
                    </Text>
                  </View>
                  <View style={styles.festInfo}>
                    <Text style={[styles.festName, { color: colors.foreground }]}>
                      {name}
                    </Text>
                    <Text style={[styles.festTithi, { color: colors.mutedForeground }]}>
                      {isMr ? f.tithiMr : f.tithi} • {isMr ? f.nakshtraMr : f.nakshatra}
                    </Text>
                  </View>
                  {f.festivalType === "major" && (
                    <View style={[styles.majorDot, { backgroundColor: "#8b1a2a" }]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    minWidth: 150,
    textAlign: "center",
  },
  todayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  todayBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  calendarCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  grid: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 4,
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  dayHeaderText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  dayCell: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayNumber: {
    fontSize: 15,
  },
  festDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  legend: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  detailCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  detailDate: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  detailVaar: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  detailChips: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  festivalBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  festivalBannerText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  majorTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  majorTagText: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  noFestivalText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  festivalListCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    padding: 16,
    paddingBottom: 12,
  },
  festivalListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  festDateBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  festDateNum: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  festDateDay: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  festInfo: {
    flex: 1,
    gap: 3,
  },
  festName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  festTithi: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  majorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
