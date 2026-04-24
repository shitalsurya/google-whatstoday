/**
 * Calendar Screen — Monthly grid with color-coded festival dots.
 * Red = festival, Blue = vrat/ekadashi, Green = holiday
 * Tap any date to open a full-detail modal.
 */

import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useMemo } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { getCalendarDay, getDotColors, calendarData, formatDisplayDate, getMarathiMonth } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_MR = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];

// Dot color scheme
const DOT_COLORS = {
  red:   "#e05c1a",
  blue:  "#3b82f6",
  green: "#22c55e",
};

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDotColorsForDate(dateStr: string) {
  const existing = calendarData.find((d) => d.date === dateStr);
  if (existing) return getDotColors(existing);
  // Check recurring
  const day = getCalendarDay(dateStr);
  if (day.festival || day.isHoliday || day.isVrat) return getDotColors(day);
  return [];
}

// ─── Calendar Grid ────────────────────────────────────────────────────────────

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  language: "en" | "mr" | "hi";
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
  while (cells.length % 7 !== 0) cells.push(null);

  const dayLabels = language === "en" ? DAYS_EN : DAYS_MR;

  return (
    <View style={styles.grid}>
      {/* Day headers */}
      <View style={styles.dayHeaderRow}>
        {dayLabels.map((d, i) => (
          <View key={i} style={styles.dayHeaderCell}>
            <Text style={[styles.dayHeaderText, { color: i === 0 ? "#e05c1a" : colors.mutedForeground }]}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Date rows */}
      {Array.from({ length: cells.length / 7 }, (_, rowIdx) => (
        <View key={rowIdx} style={styles.weekRow}>
          {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
            if (!day) return <View key={colIdx} style={styles.dayCell} />;

            const ds = dateString(year, month, day);
            const isSelected = ds === selectedDate;
            const isToday = ds === today;
            const dots = getDotColorsForDate(ds);
            const isSunday = colIdx === 0;

            return (
              <Pressable
                key={colIdx}
                onPress={() => { onSelectDate(ds); Haptics.selectionAsync(); }}
                style={[
                  styles.dayCell,
                  isSelected && { backgroundColor: colors.primary, borderRadius: 12 },
                  isToday && !isSelected && { borderWidth: 2, borderColor: colors.primary, borderRadius: 12 },
                ]}
              >
                <Text style={[
                  styles.dayNumber,
                  {
                    color: isSelected ? "#ffffff" : isToday ? colors.primary : isSunday ? "#e05c1a" : colors.foreground,
                    fontFamily: (isSelected || isToday) ? "Inter_700Bold" : "Inter_400Regular",
                  },
                ]}>
                  {day}
                </Text>

                {/* Multi-colored dots */}
                {dots.length > 0 && (
                  <View style={styles.dotsRow}>
                    {dots.slice(0, 3).map((color, di) => (
                      <View
                        key={di}
                        style={[
                          styles.festDot,
                          { backgroundColor: isSelected ? "rgba(255,255,255,0.9)" : DOT_COLORS[color] },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ─── Day Detail Modal ─────────────────────────────────────────────────────────

interface DayModalProps {
  dateStr: string;
  language: "en" | "mr" | "hi";
  onClose: () => void;
}

function DayDetailModal({ dateStr, language, onClose }: DayModalProps) {
  const isMr = language !== "en";
  const day = getCalendarDay(dateStr);
  const mm = getMarathiMonth(dateStr);

  const festival = isMr ? (day.festivalMr ?? day.mainEventMr) : (day.festival ?? day.mainEvent);
  const desc = isMr ? (day.mainEventDescMr ?? day.mainEventDesc) : day.mainEventDesc;
  const indianItems = isMr ? day.indianSignificanceMr : day.indianSignificance;
  const vrat = isMr ? day.vratMr : day.vrat;
  const history = isMr ? day.historyFactMr : day.historyFact;
  const dyk = isMr ? (day.didYouKnowMr ?? day.quoteMr) : (day.didYouKnow ?? day.quote);
  const global = isMr ? day.globalObservanceMr : day.globalObservance;
  const dots = getDotColors(day);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          {/* Handle */}
          <View style={modal.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={modal.header}>
              <View style={{ flex: 1 }}>
                <Text style={modal.dateLine}>{formatDisplayDate(dateStr, isMr ? "mr" : "en")}</Text>
                <Text style={modal.dayLine}>
                  {isMr ? day.vaarMr : day.vaar} • {isMr ? mm.nameMr : mm.name}
                </Text>
              </View>
              <Pressable onPress={onClose} style={modal.closeBtn}>
                <Feather name="x" size={20} color="#555" />
              </Pressable>
            </View>

            {/* Panchang chips */}
            <View style={modal.chipsRow}>
              <ModalChip icon="moon-waning-crescent" label={isMr ? `${day.tithiMr}` : day.tithi} />
              <ModalChip icon="star-four-points" label={isMr ? day.nakshtraMr : day.nakshatra} />
              <ModalChip icon="weather-sunny" label={isMr ? `${day.pakshaMr} पक्ष` : `${day.paksha} Paksha`} />
            </View>

            {/* Dot legend for this day */}
            {dots.length > 0 && (
              <View style={modal.dotBadgesRow}>
                {dots.includes("red") && <DotBadge color="red" label={isMr ? "सण" : "Festival"} />}
                {dots.includes("blue") && <DotBadge color="blue" label={isMr ? "व्रत" : "Vrat"} />}
                {dots.includes("green") && <DotBadge color="green" label={isMr ? "सुट्टी" : "Holiday"} />}
              </View>
            )}

            {/* Festival banner */}
            {festival ? (
              <View style={modal.festivalBanner}>
                <Text style={modal.festivalBannerEmoji}>🎊</Text>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={modal.festivalBannerName}>{festival}</Text>
                  {desc && <Text style={modal.festivalBannerDesc}>{desc}</Text>}
                </View>
              </View>
            ) : (
              <View style={modal.noFestivalBox}>
                <Text style={modal.noFestivalText}>
                  {isMr ? "आज विशेष सण नाही" : "No special festival today"}
                </Text>
              </View>
            )}

            {/* Vrat */}
            {vrat && (
              <View style={modal.infoRow}>
                <View style={[modal.infoIcon, { backgroundColor: "#ede9fe" }]}>
                  <MaterialCommunityIcons name="hands-pray" size={16} color="#7c3aed" />
                </View>
                <Text style={modal.infoText}>{isMr ? "व्रत: " : "Vrat: "}{vrat}</Text>
              </View>
            )}

            {/* Indian significance */}
            {indianItems && indianItems.length > 0 && (
              <View style={modal.section}>
                <Text style={modal.sectionTitle}>🇮🇳 {isMr ? "भारतीय महत्त्व" : "Indian Significance"}</Text>
                {indianItems.map((item, i) => (
                  <View key={i} style={modal.bullet}>
                    <View style={[modal.bulletDot, { backgroundColor: "#3b82f6" }]} />
                    <Text style={modal.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Global observance */}
            {global && (
              <View style={modal.section}>
                <Text style={modal.sectionTitle}>🌍 {isMr ? "जागतिक पालन" : "Global Observance"}</Text>
                <Text style={modal.bodyText}>{global}</Text>
              </View>
            )}

            {/* History */}
            {history && (
              <View style={modal.section}>
                <Text style={modal.sectionTitle}>⏳ {isMr ? "इतिहासातील आजचा दिवस" : "On This Day in History"}</Text>
                <Text style={modal.bodyText}>{history}</Text>
              </View>
            )}

            {/* Did you Know */}
            {dyk && (
              <View style={modal.section}>
                <Text style={modal.sectionTitle}>💡 {isMr ? "माहित आहे का?" : "Did you Know?"}</Text>
                <Text style={modal.bodyText}>{dyk}</Text>
              </View>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function ModalChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={modal.chip}>
      <MaterialCommunityIcons name={icon as any} size={13} color="#5c6bc0" />
      <Text style={modal.chipText}>{label}</Text>
    </View>
  );
}

function DotBadge({ color, label }: { color: "red" | "blue" | "green"; label: string }) {
  return (
    <View style={[modal.dotBadge, { backgroundColor: DOT_COLORS[color] + "22", borderColor: DOT_COLORS[color] + "44" }]}>
      <View style={[modal.dotBadgeDot, { backgroundColor: DOT_COLORS[color] }]} />
      <Text style={[modal.dotBadgeText, { color: DOT_COLORS[color] }]}>{label}</Text>
    </View>
  );
}

// ─── Main Calendar Screen ─────────────────────────────────────────────────────

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
  const [modalDate, setModalDate] = useState<string | null>(null);

  const monthLabel = isMr ? MONTHS_MR[viewMonth] : MONTHS_EN[viewMonth];

  const prevMonth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMonth((m) => { if (m === 0) { setViewYear((y) => y - 1); return 11; } return m - 1; });
  }, []);

  const nextMonth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMonth((m) => { if (m === 11) { setViewYear((y) => y + 1); return 0; } return m + 1; });
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
    setModalDate(date);
  }, [setSelectedDate]);

  const monthFestivals = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`;
    return calendarData.filter((d) => d.date.startsWith(prefix) && (d.festival || d.mainEvent));
  }, [viewYear, viewMonth]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top + (Platform.OS === "web" ? 10 : 8) }]}>
        <View style={styles.headerRow}>
          <View style={styles.monthNav}>
            <Pressable onPress={prevMonth} style={styles.navBtn}>
              <Feather name="chevron-left" size={22} color="#ffffff" />
            </Pressable>
            <Text style={styles.monthTitle}>{monthLabel} {viewYear}</Text>
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}
      >
        {/* Calendar Card */}
        <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            language={language}
          />

          {/* Legend */}
          <View style={[styles.legend, { borderTopColor: colors.border }]}>
            <LegendItem color={DOT_COLORS.red}   label={isMr ? "सण" : "Festival"} />
            <LegendItem color={DOT_COLORS.blue}  label={isMr ? "व्रत" : "Vrat / Ekadashi"} />
            <LegendItem color={DOT_COLORS.green} label={isMr ? "सुट्टी" : "Holiday"} />
          </View>
        </View>

        {/* Month Festivals List */}
        {monthFestivals.length > 0 && (
          <View style={[styles.festivalListCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {isMr ? `${monthLabel} ${viewYear} चे सण` : `Festivals in ${monthLabel} ${viewYear}`}
            </Text>
            {monthFestivals.map((f, i) => {
              const dayDate = new Date(f.date);
              const dayNum = dayDate.getDate();
              const dayName = isMr ? DAYS_MR[dayDate.getDay()] : DAYS_EN[dayDate.getDay()];
              const name = isMr ? (f.festivalMr ?? f.mainEventMr ?? f.mainEvent) : (f.festival ?? f.mainEvent);
              const isLast = i === monthFestivals.length - 1;
              const dotColorsForDay = getDotColors(f);
              const isHoliday = f.isHoliday;

              return (
                <Pressable
                  key={f.date}
                  onPress={() => handleSelectDate(f.date)}
                  style={[styles.festivalListItem, { borderBottomColor: colors.border, borderBottomWidth: isLast ? 0 : 1 }]}
                >
                  <View style={[styles.festDateBadge, { backgroundColor: isHoliday ? "#fde68a" : colors.secondary }]}>
                    <Text style={[styles.festDateNum, { color: isHoliday ? "#92400e" : colors.primary }]}>{dayNum}</Text>
                    <Text style={[styles.festDateDay, { color: isHoliday ? "#92400e" : colors.primary }]}>{dayName}</Text>
                  </View>
                  <View style={styles.festInfo}>
                    <Text style={[styles.festName, { color: colors.foreground }]}>{name}</Text>
                    <Text style={[styles.festTithi, { color: colors.mutedForeground }]}>
                      {isMr ? f.tithiMr : f.tithi}
                    </Text>
                  </View>
                  {/* Dots */}
                  <View style={styles.festDots}>
                    {dotColorsForDay.map((dc, di) => (
                      <View key={di} style={[styles.festListDot, { backgroundColor: DOT_COLORS[dc] }]} />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Day Detail Modal */}
      {modalDate && (
        <DayDetailModal
          dateStr={modalDate}
          language={language}
          onClose={() => setModalDate(null)}
        />
      )}
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const colors = useColors();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 14, paddingHorizontal: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  monthNav: { flexDirection: "row", alignItems: "center", gap: 8 },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  monthTitle: { color: "#ffffff", fontSize: 18, fontFamily: "Inter_700Bold", minWidth: 150, textAlign: "center" },
  todayBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  todayBtnText: { color: "#ffffff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scrollContent: { padding: 16, gap: 14 },
  calendarCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  grid: { paddingHorizontal: 8, paddingTop: 10, paddingBottom: 4 },
  dayHeaderRow: { flexDirection: "row", marginBottom: 4 },
  dayHeaderCell: { flex: 1, alignItems: "center", paddingVertical: 6 },
  dayHeaderText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.3 },
  weekRow: { flexDirection: "row", marginBottom: 2 },
  dayCell: { flex: 1, height: 50, alignItems: "center", justifyContent: "center", gap: 2 },
  dayNumber: { fontSize: 15 },
  dotsRow: { flexDirection: "row", gap: 2 },
  festDot: { width: 5, height: 5, borderRadius: 3 },
  legend: { flexDirection: "row", gap: 14, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  festivalListCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", padding: 16, paddingBottom: 12 },
  festivalListItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 14 },
  festDateBadge: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  festDateNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  festDateDay: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  festInfo: { flex: 1, gap: 3 },
  festName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  festTithi: { fontSize: 12, fontFamily: "Inter_400Regular" },
  festDots: { flexDirection: "row", gap: 4 },
  festListDot: { width: 8, height: 8, borderRadius: 4 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#ffffff", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 20, maxHeight: "85%", paddingBottom: 20 },
  handle: { width: 40, height: 4, backgroundColor: "#d1d5db", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  dateLine: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1a1a2e" },
  dayLine: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#888888", marginTop: 2 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#eff6ff", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#3b4f9c" },
  dotBadgesRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  dotBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1 },
  dotBadgeDot: { width: 7, height: 7, borderRadius: 4 },
  dotBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  festivalBanner: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#fff7ed", borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#fed7aa" },
  festivalBannerEmoji: { fontSize: 24, marginTop: 2 },
  festivalBannerName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#9a3412" },
  festivalBannerDesc: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#7c2d12", lineHeight: 18 },
  noFestivalBox: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 14, marginBottom: 12, alignItems: "center" },
  noFestivalText: { color: "#9ca3af", fontSize: 13, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  infoIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", color: "#374151" },
  section: { borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1a1a2e", marginBottom: 8 },
  bodyText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#374151", lineHeight: 20 },
  bullet: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: "#374151", lineHeight: 20 },
});
