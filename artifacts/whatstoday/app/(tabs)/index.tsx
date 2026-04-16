/**
 * What's Today — redesigned main screen.
 * Dark background, large date, single info card with colored sections.
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
import { useApp } from "@/context/AppContext";
import { getCalendarDay, getTodayString, formatDisplayDate } from "@/data/festivals";

// Dark background color — consistent across light/dark mode for this screen
const DARK_BG = "#0f0f1a";
const CARD_BG = "#ffffff";

// Section header colors matching the screenshot
const SECTION_COLORS = {
  indian: { bg: "#f5a623", text: "#7a3a00" },
  global: { bg: "#27ae60", text: "#ffffff" },
  history: { bg: "#5c6bc0", text: "#ffffff" },
  didYouKnow: { bg: "#f1c40f", text: "#5a4000" },
};

interface SectionHeaderProps {
  emoji: string;
  title: string;
  color: { bg: string; text: string };
}

function SectionHeader({ emoji, title, color }: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, { backgroundColor: color.bg }]}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={[styles.sectionTitle, { color: color.text }]}>{title}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, setLanguage, selectedDate, setSelectedDate } = useApp();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSharing, setIsSharing] = useState(false);

  const isMr = language === "mr";
  const todayStr = getTodayString();
  const day = getCalendarDay(selectedDate);
  const isToday = selectedDate === todayStr;

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "mr" : "en");
    Haptics.selectionAsync();
  }, [language, setLanguage]);

  const goToToday = useCallback(() => {
    setSelectedDate(todayStr);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [todayStr, setSelectedDate]);

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
    } catch (e) {
      console.error("Share error:", e);
    } finally {
      setIsSharing(false);
    }
  }, [isMr]);

  // Build display values
  const displayDate = formatDisplayDate(selectedDate, language);
  const vaarText = isMr ? day.vaarMr : day.vaar;
  const mainEvent = isMr ? (day.mainEventMr ?? day.festivalMr ?? day.mainEvent ?? day.festival) : (day.mainEvent ?? day.festival);
  const mainEventDesc = isMr ? day.mainEventDescMr ?? day.mainEventDesc : day.mainEventDesc;
  const indianItems = isMr ? day.indianSignificanceMr : day.indianSignificance;
  const vrat = isMr ? day.vratMr : day.vrat;
  const globalObservance = isMr ? day.globalObservanceMr : day.globalObservance;
  const historyFact = isMr ? day.historyFactMr : day.historyFact;
  const didYouKnow = isMr ? day.didYouKnowMr ?? day.quoteMr : day.didYouKnow ?? day.quote;

  return (
    <View style={[styles.container, { backgroundColor: DARK_BG }]}>
      {/* Top bar — language + settings */}
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + (Platform.OS === "web" ? 10 : 6) },
        ]}
      >
        <Pressable
          onPress={toggleLanguage}
          style={styles.langBtn}
        >
          <Text style={styles.langBtnText}>
            {language === "en" ? "मराठी" : "Eng"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/settings")}
          style={styles.settingsBtn}
        >
          <Feather name="settings" size={18} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </View>

      {/* Date Strip */}
      <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Large date display */}
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{displayDate} , {vaarText}</Text>
        </View>

        {/* Back to today */}
        {!isToday && (
          <Pressable onPress={goToToday} style={styles.backTodayBtn}>
            <MaterialCommunityIcons name="calendar-today" size={14} color="#f5a623" />
            <Text style={styles.backTodayText}>
              {isMr ? "आजकडे परत जा" : "Back to Today"}
            </Text>
          </Pressable>
        )}

        {/* Main info card wrapped in ViewShot for sharing */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
        >
          <View style={[styles.mainCard, { backgroundColor: CARD_BG }]}>
            {/* Share button — top right inside card */}
            <View style={styles.cardTopRow}>
              <View style={{ flex: 1 }} />
              <Pressable
                onPress={handleShare}
                disabled={isSharing}
                style={styles.shareBtn}
              >
                {isSharing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Feather name="share-2" size={14} color="#ffffff" />
                    <Text style={styles.shareBtnText}>
                      {isMr ? "शेअर" : "Share"}
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Main Event */}
            {mainEvent ? (
              <View style={styles.mainEventSection}>
                <Text style={styles.mainEventTitle}>{mainEvent}</Text>
                {mainEventDesc ? (
                  <Text style={styles.mainEventDesc}>{mainEventDesc}</Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.mainEventSection}>
                <Text style={styles.mainEventTitle}>
                  {isMr ? "आजचे पंचांग" : "Today's Panchang"}
                </Text>
                <Text style={styles.mainEventDesc}>
                  {isMr
                    ? `${day.tithiMr} • ${day.pakshaMr} पक्ष • ${day.nakshtraMr}`
                    : `${day.tithi} • ${day.paksha} Paksha • ${day.nakshatra}`}
                </Text>
              </View>
            )}

            {/* Indian Significance */}
            {(indianItems && indianItems.length > 0) || vrat ? (
              <View style={styles.section}>
                <SectionHeader
                  emoji="🇮🇳"
                  title={isMr ? "भारतीय महत्त्व" : "Indian Significance"}
                  color={SECTION_COLORS.indian}
                />
                <View style={styles.sectionBody}>
                  {indianItems?.map((item, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <View style={[styles.bullet, { backgroundColor: "#3b82f6" }]} />
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
                  {vrat ? (
                    <View style={styles.bulletRow}>
                      <View style={[styles.bullet, { backgroundColor: "#22c55e" }]} />
                      <Text style={styles.bulletText}>
                        {isMr ? "व्रत • " : "Vrat • "}{vrat}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* Global Observance */}
            {globalObservance ? (
              <View style={styles.section}>
                <SectionHeader
                  emoji="🌍"
                  title={isMr ? "जागतिक पालन" : "Global Observance"}
                  color={SECTION_COLORS.global}
                />
                <View style={styles.sectionBody}>
                  <Text style={styles.sectionBodyText}>{globalObservance}</Text>
                </View>
              </View>
            ) : null}

            {/* On This Day in History */}
            {historyFact ? (
              <View style={styles.section}>
                <SectionHeader
                  emoji="⏳"
                  title={isMr ? "इतिहासातील आजचा दिवस" : "On This Day in History"}
                  color={SECTION_COLORS.history}
                />
                <View style={styles.sectionBody}>
                  <Text style={styles.sectionBodyText}>{historyFact}</Text>
                </View>
              </View>
            ) : null}

            {/* Did you Know */}
            {didYouKnow ? (
              <View style={[styles.section, { marginBottom: 0 }]}>
                <View style={styles.didYouKnowHeader}>
                  <SectionHeader
                    emoji="💡"
                    title={isMr ? "माहित आहे का?" : "Did you Know?"}
                    color={SECTION_COLORS.didYouKnow}
                  />
                </View>
                <View style={styles.sectionBody}>
                  <Text style={styles.sectionBodyText}>{didYouKnow}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </ViewShot>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 6,
    gap: 10,
  },
  langBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  langBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    gap: 10,
  },
  dateDisplay: {
    alignItems: "center",
    paddingVertical: 10,
  },
  dateText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  backTodayBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(245,166,35,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.3)",
  },
  backTodayText: {
    color: "#f5a623",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  mainCard: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#27ae60",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  mainEventSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 5,
  },
  mainEventTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    textAlign: "center",
  },
  mainEventDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#666666",
    textAlign: "center",
    lineHeight: 19,
    fontStyle: "italic",
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  sectionEmoji: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  sectionBodyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#333333",
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#333333",
    lineHeight: 20,
  },
  didYouKnowHeader: {
    // wrapper so the section border-top shows correctly
  },
});
