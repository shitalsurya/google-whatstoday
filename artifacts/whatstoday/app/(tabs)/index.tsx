/**
 * Main "What's Today" screen — shows the Indian calendar card for the selected date.
 * Features: date strip, shareable card, swipe navigation, notifications.
 */

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

import { DateStrip } from "@/components/DateStrip";
import { TodayCard } from "@/components/TodayCard";
import { useApp } from "@/context/AppContext";
import { getCalendarDay, getTodayString } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, setLanguage, selectedDate, setSelectedDate } = useApp();
  const cardRef = useRef<View>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [isSharing, setIsSharing] = useState(false);

  const isMr = language === "mr";
  const todayStr = getTodayString();
  const day = getCalendarDay(selectedDate);
  const isToday = selectedDate === todayStr;

  const goToToday = useCallback(() => {
    setSelectedDate(todayStr);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [todayStr, setSelectedDate]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "mr" : "en");
    Haptics.selectionAsync();
  }, [language, setLanguage]);

  const handleShare = useCallback(async () => {
    if (Platform.OS === "web") {
      Alert.alert("Share", isMr ? "वेबवर शेअर उपलब्ध नाही" : "Sharing not available on web");
      return;
    }

    setIsSharing(true);
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: isMr ? "WhatsToday कार्ड शेअर करा" : "Share WhatsToday Card",
          });
        }
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  }, [isMr]);

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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>
              {isMr ? "आजचे पंचांग" : "WhatsToday"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isMr ? "भारतीय दिनदर्शिका" : "Indian Calendar"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {/* Language Toggle */}
            <Pressable
              onPress={toggleLanguage}
              style={[styles.langButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            >
              <Text style={styles.langButtonText}>
                {language === "en" ? "मराठी" : "Eng"}
              </Text>
            </Pressable>
            {/* Settings */}
            <Pressable
              onPress={() => router.push("/settings")}
              style={[styles.iconButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            >
              <Feather name="settings" size={18} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Date Strip */}
      <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Main Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Today button if not on today */}
        {!isToday && (
          <Pressable
            onPress={goToToday}
            style={[styles.todayButton, { backgroundColor: colors.secondary, borderColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="calendar-today" size={16} color={colors.primary} />
            <Text style={[styles.todayButtonText, { color: colors.primary }]}>
              {isMr ? "आजकडे परत जा" : "Back to Today"}
            </Text>
          </Pressable>
        )}

        {/* Shareable Card wrapped in ViewShot */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
          style={styles.viewShot}
        >
          <TodayCard day={day} cardRef={cardRef} />
        </ViewShot>

        {/* Share Button */}
        <Pressable
          onPress={handleShare}
          disabled={isSharing}
          style={[
            styles.shareButton,
            {
              backgroundColor: isSharing ? colors.muted : colors.primary,
              shadowColor: colors.primary,
            },
          ]}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color={colors.mutedForeground} />
          ) : (
            <>
              <Feather name="share-2" size={18} color="#ffffff" />
              <Text style={styles.shareButtonText}>
                {isMr ? "कार्ड शेअर करा" : "Share Card"}
              </Text>
            </>
          )}
        </Pressable>

        {/* Quick Info Cards */}
        <View style={styles.infoRow}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={24}
              color={colors.infoColor}
            />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
              {isMr ? "तिथी" : "Tithi"}
            </Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {isMr ? day.tithiMr : day.tithi}
            </Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons
              name="star-four-points-outline"
              size={24}
              color={colors.infoColor}
            />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
              {isMr ? "नक्षत्र" : "Nakshatra"}
            </Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {isMr ? day.nakshtraMr : day.nakshatra}
            </Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="sun" size={24} color={colors.infoColor} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
              {isMr ? "पक्ष" : "Paksha"}
            </Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {isMr ? day.pakshaMr : day.paksha}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  langButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  langButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    gap: 16,
  },
  viewShot: {
    // ViewShot wrapper — transparent so card renders naturally
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
  },
  infoCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});
