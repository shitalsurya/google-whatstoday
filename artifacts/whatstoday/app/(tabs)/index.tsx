/**
 * Home — modern dashboard.
 *
 * Layout:
 *   1. Header: "What's Today 🎉" + date + language switcher
 *   2. Quick chips: Tithi / Nakshatra / Yoga / Karana
 *   3. Utility cards grid (sunrise, sunset, moonrise, moonset, rahu, abhijit, brahma, festival)
 *   4. Festival alerts (today / tomorrow / coming)
 *   5. Auspicious badge + Daily suggestion
 *   6. Today Key Timings detail card
 *   7. PRESERVED EXISTING SECTIONS:
 *        - Indian Significance
 *        - On This Day in History
 *        - Did You Know
 *        - Share Card (modal preserved)
 */

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

import { ShareCard } from "@/components/ShareCard";
import { DateStrip } from "@/components/DateStrip";
import { QuickChips } from "@/components/QuickChips";
import { UtilityCards } from "@/components/UtilityCards";
import { KeyTimings } from "@/components/KeyTimings";
import { FestivalAlerts } from "@/components/FestivalAlerts";
import { AuspiciousBadge } from "@/components/AuspiciousBadge";
import { DailySuggestion } from "@/components/DailySuggestion";
import { useApp, type Language } from "@/context/AppContext";
import {
  getCalendarDay,
  getTodayString,
  formatDisplayDate,
  getMarathiMonth,
} from "@/data/festivals";
import {
  getKeyTimings,
  getYoga,
  getKarana,
  getAuspiciousLevel,
} from "@/utils/panchangUtils";
import { updateWidgetData } from "@/services/widgetService";

const DARK_BG = "#0f0f1a";
const CARD_BG = "#ffffff";

const SECTION_COLORS = {
  indian: { bg: "#f5a623", text: "#7a3a00" },
  global: { bg: "#27ae60", text: "#ffffff" },
  history: { bg: "#5c6bc0", text: "#ffffff" },
  didYouKnow: { bg: "#f1c40f", text: "#5a4000" },
};

const HEADER_LABELS = {
  en: { title: "What's Today 🎉" },
  mr: { title: "आज काय आहे? 🎉" },
  hi: { title: "आज क्या है? 🎉" },
};

const CHIP_LABELS = {
  en: { tithi: "Tithi", nakshatra: "Nakshatra", yoga: "Yoga", karana: "Karana" },
  mr: { tithi: "तिथि", nakshatra: "नक्षत्र", yoga: "योग", karana: "करण" },
  hi: { tithi: "तिथि", nakshatra: "नक्षत्र", yoga: "योग", karana: "करण" },
};

const TILE_LABELS = {
  en: {
    sunrise: "Sunrise / Sunset",
    moon: "Moonrise / Moonset",
    rahu: "Rahu Kaal",
    abhijit: "Abhijit Muhurat",
    brahma: "Brahma Muhurat",
    festival: "Festival Alert",
    none: "None today",
  },
  mr: {
    sunrise: "सूर्योदय / सूर्यास्त",
    moon: "चंद्रोदय / चंद्रास्त",
    rahu: "राहू काळ",
    abhijit: "अभिजित मुहूर्त",
    brahma: "ब्रह्म मुहूर्त",
    festival: "सण सूचना",
    none: "आज नाही",
  },
  hi: {
    sunrise: "सूर्योदय / सूर्यास्त",
    moon: "चंद्रोदय / चंद्रास्त",
    rahu: "राहु काल",
    abhijit: "अभिजीत मुहूर्त",
    brahma: "ब्रह्म मुहूर्त",
    festival: "त्यौहार सूचना",
    none: "आज नहीं",
  },
};

const COMMON = {
  en: {
    indianSig: "Indian Significance",
    globalObs: "Global Observance",
    history: "On This Day in History",
    dyk: "Did you Know?",
    todayPanchang: "Today's Panchang",
    backToToday: "Back to Today",
    share: "Share",
    shareCard: "Share Card",
    shareCta: "Share to WhatsApp / Instagram",
    next: "Next",
  },
  mr: {
    indianSig: "भारतीय महत्त्व",
    globalObs: "जागतिक पालन",
    history: "इतिहासातील आजचा दिवस",
    dyk: "माहित आहे का?",
    todayPanchang: "आजचे पंचांग",
    backToToday: "आजकडे परत जा",
    share: "शेअर",
    shareCard: "कार्ड शेअर करा",
    shareCta: "WhatsApp / Instagram वर शेअर करा",
    next: "पुढे",
  },
  hi: {
    indianSig: "भारतीय महत्व",
    globalObs: "वैश्विक पालन",
    history: "इतिहास में आज का दिन",
    dyk: "क्या आप जानते हैं?",
    todayPanchang: "आज का पंचांग",
    backToToday: "आज पर वापस",
    share: "शेयर",
    shareCard: "कार्ड शेयर करें",
    shareCta: "WhatsApp / Instagram पर शेयर करें",
    next: "अगला",
  },
};

const NEXT_LANG: Record<Language, Language> = { en: "hi", hi: "mr", mr: "en" };
const LANG_LABEL: Record<Language, string> = { en: "Eng", hi: "हिंदी", mr: "मराठी" };

function formatHeaderDate(dateStr: string, lang: Language): string {
  const d = new Date(dateStr);
  const months = {
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    mr: ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"],
    hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
  };
  const days = {
    en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    mr: ["रविवार","सोमवार","मंगळवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],
    hi: ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],
  };
  return `${d.getDate()} ${months[lang][d.getMonth()]}, ${days[lang][d.getDay()]}`;
}

function pickContent<T>(en: T | undefined, mr: T | undefined, lang: Language): T | undefined {
  if (lang === "en") return en;
  return mr ?? en;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, selectedDate, setSelectedDate, toggles } =
    useApp();
  const shareCardRef = useRef<ViewShot>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const todayStr = getTodayString();
  const day = getCalendarDay(selectedDate);
  const isToday = selectedDate === todayStr;
  const mm = getMarathiMonth(selectedDate);

  const isMrLike = language !== "en";
  const C = COMMON[language];
  const HL = HEADER_LABELS[language];
  const CL = CHIP_LABELS[language];
  const TL = TILE_LABELS[language];

  const timings = useMemo(() => getKeyTimings(selectedDate), [selectedDate]);
  const yoga = useMemo(
    () => getYoga(selectedDate, language),
    [selectedDate, language],
  );
  const karana = useMemo(
    () => getKarana(selectedDate, language),
    [selectedDate, language],
  );
  const festival = pickContent(day.festival, day.festivalMr, language);
  const auspicious = useMemo(
    () => getAuspiciousLevel(selectedDate, !!(day.festival || day.mainEvent)),
    [selectedDate, day.festival, day.mainEvent],
  );

  // Display values
  const tithiText = isMrLike ? day.tithiMr : day.tithi;
  const nakshatraText = isMrLike ? day.nakshtraMr : day.nakshatra;
  const mainEvent = pickContent(day.mainEvent ?? day.festival, day.mainEventMr ?? day.festivalMr, language);
  const mainEventDesc = pickContent(day.mainEventDesc, day.mainEventDescMr, language);
  const indianItems = pickContent(day.indianSignificance, day.indianSignificanceMr, language);
  const vrat = pickContent(day.vrat, day.vratMr, language);
  const globalObservance = pickContent(day.globalObservance, day.globalObservanceMr, language);
  const historyFact = pickContent(day.historyFact, day.historyFactMr, language);
  const didYouKnow = pickContent(day.didYouKnow ?? day.quote, day.didYouKnowMr ?? day.quoteMr, language);
  const quote = pickContent(day.quote, day.quoteMr, language);

  // Update widget data when day changes
  useEffect(() => {
    if (!toggles.widgetAutoRefresh) return;
    updateWidgetData({
      date: selectedDate,
      displayDate: formatHeaderDate(selectedDate, language),
      festival: festival ?? null,
      national: indianItems?.[0] ?? null,
      insight: didYouKnow ?? quote ?? "",
      language,
      generatedAt: Date.now(),
    });
  }, [selectedDate, language, toggles.widgetAutoRefresh, festival, indianItems, didYouKnow, quote]);

  const cycleLanguage = useCallback(() => {
    setLanguage(NEXT_LANG[language]);
    Haptics.selectionAsync();
  }, [language, setLanguage]);

  const goToToday = useCallback(() => {
    setSelectedDate(todayStr);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [todayStr, setSelectedDate]);

  const handleSharePress = useCallback(() => {
    setShowShareModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleShareCapture = useCallback(async () => {
    setIsSharing(true);
    try {
      if (Platform.OS === "web") {
        const text = `${formatDisplayDate(selectedDate, language === "en" ? "en" : "mr")}\n${festival ?? ""}\n${quote}\n— WhatsToday`;
        if (typeof navigator !== "undefined" && (navigator as any).share) {
          await (navigator as any).share({ title: "WhatsToday", text });
        } else {
          await Share.share({ message: text });
        }
        setShowShareModal(false);
        return;
      }
      if (shareCardRef.current?.capture) {
        const uri = await shareCardRef.current.capture();
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: C.shareCard,
          });
        } else {
          await Share.share({
            message: `${formatDisplayDate(selectedDate, language === "en" ? "en" : "mr")}\n${festival ?? ""}\n${quote}`,
          });
        }
      }
      setShowShareModal(false);
    } catch {
      try { await Share.share({ message: `${formatHeaderDate(selectedDate, language)} — WhatsToday` }); } catch { /* ignore */ }
    } finally {
      setIsSharing(false);
    }
  }, [selectedDate, language, festival, quote, C.shareCard]);

  const headerDate = formatHeaderDate(selectedDate, language);

  // Build chips
  const chips = [
    { emoji: "🌙", label: CL.tithi, value: tithiText },
    { emoji: "⭐", label: CL.nakshatra, value: nakshatraText },
    { emoji: "✨", label: CL.yoga, value: yoga },
    { emoji: "🔯", label: CL.karana, value: karana },
  ];

  // Build utility tiles
  const tiles = [
    { emoji: "🌅", title: TL.sunrise, primary: timings.sunrise, secondary: timings.sunset, tone: "default" as const },
    { emoji: "🌙", title: TL.moon, primary: timings.moonrise, secondary: timings.moonset, tone: "default" as const },
    { emoji: "⏰", title: TL.rahu, primary: `${timings.rahuKaal.start} – ${timings.rahuKaal.end}`, tone: "warning" as const },
    { emoji: "🟢", title: TL.abhijit, primary: `${timings.abhijitMuhurat.start} – ${timings.abhijitMuhurat.end}`, tone: "good" as const },
    { emoji: "🙏", title: TL.brahma, primary: `${timings.brahmaMuhurat.start} – ${timings.brahmaMuhurat.end}`, tone: "good" as const },
    { emoji: "🎊", title: TL.festival, primary: festival ?? mainEvent ?? TL.none, tone: "festival" as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: DARK_BG }]}>
      {/* Top header */}
      <View style={[styles.topBar, { paddingTop: insets.top + (Platform.OS === "web" ? 10 : 6) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>{HL.title}</Text>
          <Text style={styles.appDate}>📅 {headerDate}</Text>
        </View>
        <Pressable onPress={cycleLanguage} style={styles.langBtn}>
          <Text style={styles.langBtnText}>{LANG_LABEL[language]}</Text>
          <Feather name="chevron-down" size={12} color="#ffffff" />
        </Pressable>
      </View>

      {/* Date Strip — preserved */}
      <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick chips */}
        {toggles.showPanchang && (
          <View style={{ marginHorizontal: -14 }}>
            <QuickChips chips={chips} />
          </View>
        )}

        {/* Back to today */}
        {!isToday && (
          <Pressable onPress={goToToday} style={styles.backTodayBtn}>
            <Feather name="rotate-ccw" size={14} color="#f5a623" />
            <Text style={styles.backTodayText}>{C.backToToday}</Text>
          </Pressable>
        )}

        {/* Auspicious badge */}
        {toggles.showPanchang && (
          <AuspiciousBadge level={auspicious} language={language} />
        )}

        {/* Utility tiles grid */}
        {toggles.showMuhurat && <UtilityCards tiles={tiles} />}

        {/* Festival alerts */}
        {toggles.showFestivalAlerts && (
          <FestivalAlerts selectedDate={selectedDate} language={language} />
        )}

        {/* Daily suggestion */}
        {toggles.showDailySuggestions && (
          <DailySuggestion level={auspicious} language={language} />
        )}

        {/* Today Key Timings detailed card */}
        {toggles.showMuhurat && (
          <KeyTimings timings={timings} language={language} />
        )}

        {/* ───────── PRESERVED EXISTING CONTENT BELOW ───────── */}

        {/* Main info card — Indian Significance, History, DYK, Share */}
        <View style={[styles.mainCard, { backgroundColor: CARD_BG }]}>
          <View style={styles.cardTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainEventTitle}>
                {mainEvent ?? C.todayPanchang}
              </Text>
              <Text style={styles.mainEventDesc}>
                {mainEventDesc ?? `${tithiText} • ${isMrLike ? day.pakshaMr : day.paksha} ${isMrLike ? "पक्ष" : "Paksha"} • ${nakshatraText}`}
              </Text>
            </View>
            <Pressable onPress={handleSharePress} style={styles.shareBtn}>
              <Feather name="share-2" size={14} color="#ffffff" />
              <Text style={styles.shareBtnText}>{C.share}</Text>
            </Pressable>
          </View>

          {/* Indian Significance */}
          {((indianItems && indianItems.length > 0) || vrat) && (
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: SECTION_COLORS.indian.bg }]}>
                <Text style={styles.sectionEmoji}>🇮🇳</Text>
                <Text style={[styles.sectionTitle, { color: SECTION_COLORS.indian.text }]}>{C.indianSig}</Text>
              </View>
              <View style={styles.sectionBody}>
                {indianItems?.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={[styles.bullet, { backgroundColor: "#3b82f6" }]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
                {vrat && (
                  <View style={styles.bulletRow}>
                    <View style={[styles.bullet, { backgroundColor: "#a855f7" }]} />
                    <Text style={styles.bulletText}>{(language === "en" ? "Vrat • " : "व्रत • ")}{vrat}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Global Observance */}
          {globalObservance && (
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: SECTION_COLORS.global.bg }]}>
                <Text style={styles.sectionEmoji}>🌍</Text>
                <Text style={[styles.sectionTitle, { color: SECTION_COLORS.global.text }]}>{C.globalObs}</Text>
              </View>
              <View style={styles.sectionBody}>
                <Text style={styles.sectionBodyText}>{globalObservance}</Text>
              </View>
            </View>
          )}

          {/* History */}
          {historyFact && (
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: SECTION_COLORS.history.bg }]}>
                <Text style={styles.sectionEmoji}>⏳</Text>
                <Text style={[styles.sectionTitle, { color: SECTION_COLORS.history.text }]}>{C.history}</Text>
              </View>
              <View style={styles.sectionBody}>
                <Text style={styles.sectionBodyText}>{historyFact}</Text>
              </View>
            </View>
          )}

          {/* DYK */}
          {didYouKnow && (
            <View style={[styles.section, { marginBottom: 0 }]}>
              <View style={[styles.sectionHeader, { backgroundColor: SECTION_COLORS.didYouKnow.bg }]}>
                <Text style={styles.sectionEmoji}>💡</Text>
                <Text style={[styles.sectionTitle, { color: SECTION_COLORS.didYouKnow.text }]}>{C.dyk}</Text>
              </View>
              <View style={styles.sectionBody}>
                <Text style={styles.sectionBodyText}>{didYouKnow}</Text>
              </View>
            </View>
          )}

          {/* Quote footer */}
          <View style={styles.quoteFooter}>
            <Text style={styles.quoteText}>"{quote}"</Text>
          </View>
        </View>
      </ScrollView>

      {/* Share Modal — preserved */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{C.shareCard}</Text>
              <Pressable onPress={() => setShowShareModal(false)} style={styles.modalCloseBtn}>
                <Feather name="x" size={20} color="#333" />
              </Pressable>
            </View>

            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalCardContainer}
            >
              <ViewShot
                ref={shareCardRef}
                options={{ format: "png", quality: 1.0 }}
                style={styles.viewShotContainer}
              >
                <ShareCard day={day} language={language === "en" ? "en" : "mr"} />
              </ViewShot>
            </ScrollView>

            <Pressable
              onPress={handleShareCapture}
              disabled={isSharing}
              style={[styles.modalShareBtn, isSharing && styles.modalShareBtnDisabled]}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Feather name="share-2" size={18} color="#ffffff" />
                  <Text style={styles.modalShareBtnText}>{C.shareCta}</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 6,
    gap: 10,
  },
  appTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  appDate: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  langBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    gap: 10,
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
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#27ae60",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  shareBtnText: { color: "#ffffff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  mainEventTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#1a1a2e" },
  mainEventDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#666666",
    fontStyle: "italic",
    marginTop: 4,
    lineHeight: 18,
  },
  section: { borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  sectionEmoji: { fontSize: 16 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1 },
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
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  bulletText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#333333",
    lineHeight: 20,
  },
  quoteFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
  },
  quoteText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#555555",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },

  // Share modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
    gap: 16,
    maxHeight: "90%",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1a1a2e" },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCardContainer: { alignItems: "center", paddingVertical: 8 },
  viewShotContainer: { borderRadius: 20, overflow: "hidden" },
  modalShareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#4285F4",
    paddingVertical: 16,
    borderRadius: 16,
  },
  modalShareBtnDisabled: { opacity: 0.6 },
  modalShareBtnText: { color: "#ffffff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
