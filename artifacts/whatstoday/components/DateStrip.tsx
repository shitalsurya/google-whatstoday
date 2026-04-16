/**
 * DateStrip: Horizontal scrollable date picker for swiping between dates.
 */

import React, { useCallback, useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface DateStripProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

function generateDates(centerDate: string, count: number = 14): string[] {
  const dates: string[] = [];
  const center = new Date(centerDate);
  const start = Math.floor(count / 2);

  for (let i = -start; i <= start; i++) {
    const d = new Date(center);
    d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dates.push(dateStr);
  }
  return dates;
}

function getDayLabel(dateString: string, language: "en" | "mr"): { day: string; date: number } {
  const date = new Date(dateString);
  const dayNames = {
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    mr: ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"],
  };
  return {
    day: dayNames[language][date.getDay()],
    date: date.getDate(),
  };
}

function isToday(dateString: string): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return dateString === todayStr;
}

export function DateStrip({ selectedDate, onDateSelect }: DateStripProps) {
  const colors = useColors();
  const { language } = useApp();
  const scrollRef = useRef<ScrollView>(null);
  const dates = generateDates(selectedDate);

  const selectedIndex = dates.findIndex((d) => d === selectedDate);

  useEffect(() => {
    // Scroll to center the selected date
    if (scrollRef.current && selectedIndex >= 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(0, (selectedIndex - 2) * 64),
          animated: true,
        });
      }, 100);
    }
  }, [selectedDate, selectedIndex]);

  const handleSelect = useCallback(
    (date: string) => {
      onDateSelect(date);
    },
    [onDateSelect],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date) => {
          const isSelected = date === selectedDate;
          const today = isToday(date);
          const { day, date: dayNum } = getDayLabel(date, language);

          return (
            <Pressable
              key={date}
              onPress={() => handleSelect(date)}
              style={[
                styles.dateItem,
                isSelected && {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 3,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isSelected
                      ? "rgba(255,255,255,0.85)"
                      : colors.mutedForeground,
                  },
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  {
                    color: isSelected ? "#ffffff" : colors.foreground,
                    fontFamily: isSelected ? "Inter_700Bold" : "Inter_500Medium",
                  },
                ]}
              >
                {dayNum}
              </Text>
              {today && !isSelected && (
                <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    flexDirection: "row",
  },
  dateItem: {
    width: 52,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  dayText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: 18,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 1,
  },
});
