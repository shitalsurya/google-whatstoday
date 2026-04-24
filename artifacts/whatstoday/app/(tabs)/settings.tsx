/**
 * Settings tab — third tab in bottom navigation.
 * Includes language picker, dashboard feature toggles, widget refresh,
 * auto-update controls, dark mode, and standard rate / share / privacy actions.
 */

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, type Language } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { VERSION_CONFIG } from "@/constants/versionConfig";
import {
  checkForOtaUpdate,
  downloadOtaUpdate,
  reloadAppForUpdate,
} from "@/services/updateService";
import {
  requestNotificationPermission,
  scheduleDailyMorningNotification,
} from "@/services/notifications";

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "mr", label: "मराठी" },
];

const PRIVACY_URL = "https://example.com/whatstoday/privacy";

const T = {
  en: {
    settings: "Settings",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    darkModeDesc: "Use dark theme",
    language: "Language",
    dashboard: "Dashboard",
    showPanchang: "Show Panchang Data",
    showPanchangDesc: "Tithi, Nakshatra, Yoga, Karana",
    showMuhurat: "Show Muhurat",
    showMuhuratDesc: "Rahu Kaal, Brahma & Abhijit Muhurat",
    showFestivalAlerts: "Show Festival Alerts",
    showFestivalAlertsDesc: "Today, tomorrow, upcoming",
    showDailySuggestions: "Show Daily Suggestions",
    showDailySuggestionsDesc: "Good for / Avoid",
    notifications: "Notifications",
    dailyNotif: "Daily Notifications",
    dailyNotifDesc: "Morning panchang at 8 AM",
    widget: "Widget",
    widgetAuto: "Widget Auto Refresh",
    widgetAutoDesc: "Refresh widget content daily",
    updates: "Updates",
    autoUpdate: "Auto Update Enabled",
    autoUpdateDesc: "Silent OTA download in background",
    checkUpdates: "Check for Updates",
    currentVersion: "Current version",
    about: "About",
    rateApp: "Rate App",
    shareApp: "Share App",
    privacyPolicy: "Privacy Policy",
    appName: "WhatsToday",
    aboutDesc:
      "The next-gen smart calendar for festivals, tithi, special dates, and reminders.",
    shareMessage:
      "Try WhatsToday — a beautiful Indian calendar app with daily panchang, festivals, and muhurat. https://example.com/whatstoday",
    checkingUpdate: "Checking for updates…",
    upToDate: "You are on the latest version.",
    updateAvailable: "Update available — downloading…",
    updateReady: "Update ready. Restart now?",
    restart: "Restart",
    later: "Later",
    error: "Could not check for updates.",
  },
  mr: {
    settings: "सेटिंग्ज",
    appearance: "देखावा",
    darkMode: "डार्क मोड",
    darkModeDesc: "गडद थीम वापरा",
    language: "भाषा",
    dashboard: "डॅशबोर्ड",
    showPanchang: "पंचांग डेटा दाखवा",
    showPanchangDesc: "तिथि, नक्षत्र, योग, करण",
    showMuhurat: "मुहूर्त दाखवा",
    showMuhuratDesc: "राहू काळ, ब्रह्म व अभिजित मुहूर्त",
    showFestivalAlerts: "सण सूचना दाखवा",
    showFestivalAlertsDesc: "आज, उद्या, येणारे",
    showDailySuggestions: "दैनिक सूचना दाखवा",
    showDailySuggestionsDesc: "योग्य / टाळावे",
    notifications: "सूचना",
    dailyNotif: "दैनिक सूचना",
    dailyNotifDesc: "सकाळी ८ वाजता पंचांग",
    widget: "विजेट",
    widgetAuto: "विजेट ऑटो रीफ्रेश",
    widgetAutoDesc: "विजेट दररोज ताजे करा",
    updates: "अपडेट्स",
    autoUpdate: "ऑटो अपडेट चालू",
    autoUpdateDesc: "पार्श्वभूमीत OTA डाउनलोड",
    checkUpdates: "अपडेट्स तपासा",
    currentVersion: "सध्याची आवृत्ती",
    about: "माहिती",
    rateApp: "रेट अॅप",
    shareApp: "अॅप शेअर करा",
    privacyPolicy: "गोपनीयता धोरण",
    appName: "WhatsToday",
    aboutDesc:
      "सण, तिथि, खास तारखा आणि स्मरणांसाठी पुढच्या पिढीचे स्मार्ट दिनदर्शिका.",
    shareMessage:
      "WhatsToday वापरून पहा — एक सुंदर भारतीय कॅलेंडर अॅप. https://example.com/whatstoday",
    checkingUpdate: "अपडेट तपासत आहे…",
    upToDate: "तुमची आवृत्ती ताजी आहे.",
    updateAvailable: "अपडेट उपलब्ध — डाउनलोड होत आहे…",
    updateReady: "अपडेट तयार. आता रीस्टार्ट करायचे?",
    restart: "रीस्टार्ट",
    later: "नंतर",
    error: "अपडेट तपासता आले नाही.",
  },
  hi: {
    settings: "सेटिंग्स",
    appearance: "दिखावट",
    darkMode: "डार्क मोड",
    darkModeDesc: "गहरी थीम का उपयोग करें",
    language: "भाषा",
    dashboard: "डैशबोर्ड",
    showPanchang: "पंचांग डेटा दिखाएं",
    showPanchangDesc: "तिथि, नक्षत्र, योग, करण",
    showMuhurat: "मुहूर्त दिखाएं",
    showMuhuratDesc: "राहु काल, ब्रह्म व अभिजीत मुहूर्त",
    showFestivalAlerts: "त्यौहार सूचना दिखाएं",
    showFestivalAlertsDesc: "आज, कल, आने वाले",
    showDailySuggestions: "दैनिक सुझाव दिखाएं",
    showDailySuggestionsDesc: "उपयुक्त / बचें",
    notifications: "सूचनाएं",
    dailyNotif: "दैनिक सूचनाएं",
    dailyNotifDesc: "सुबह 8 बजे पंचांग",
    widget: "विजेट",
    widgetAuto: "विजेट ऑटो रीफ्रेश",
    widgetAutoDesc: "विजेट सामग्री दैनिक ताज़ा करें",
    updates: "अपडेट्स",
    autoUpdate: "ऑटो अपडेट चालू",
    autoUpdateDesc: "पृष्ठभूमि में OTA डाउनलोड",
    checkUpdates: "अपडेट्स देखें",
    currentVersion: "वर्तमान वर्ज़न",
    about: "जानकारी",
    rateApp: "ऐप रेट करें",
    shareApp: "ऐप शेयर करें",
    privacyPolicy: "गोपनीयता नीति",
    appName: "WhatsToday",
    aboutDesc:
      "त्यौहारों, तिथि, खास तारीखों और रिमाइंडर्स के लिए नेक्स्ट-जन स्मार्ट कैलेंडर.",
    shareMessage:
      "WhatsToday आज़माएं — एक खूबसूरत भारतीय कैलेंडर ऐप. https://example.com/whatstoday",
    checkingUpdate: "अपडेट देख रहा है…",
    upToDate: "आप नवीनतम वर्ज़न पर हैं.",
    updateAvailable: "अपडेट उपलब्ध — डाउनलोड हो रहा है…",
    updateReady: "अपडेट तैयार. अभी रीस्टार्ट करें?",
    restart: "रीस्टार्ट",
    later: "बाद में",
    error: "अपडेट नहीं देख सका.",
  },
};

export default function SettingsTabScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    notificationsEnabled,
    setNotificationsEnabled,
    toggles,
    setToggle,
  } = useApp();
  const t = T[language];
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const handleNotificationToggle = async (value: boolean) => {
    if (Platform.OS === "web") {
      Alert.alert(t.dailyNotif, "Notifications not available on web");
      return;
    }
    if (value) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        await scheduleDailyMorningNotification("WhatsToday", t.dailyNotifDesc);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert(t.dailyNotif, "Please grant notification permissions");
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleCheckUpdates = async () => {
    if (isCheckingUpdate) return;
    setIsCheckingUpdate(true);
    Haptics.selectionAsync();
    try {
      const status = await checkForOtaUpdate();
      if (status.type === "available") {
        Alert.alert(t.checkUpdates, t.updateAvailable);
        const dl = await downloadOtaUpdate();
        if (dl.type === "downloaded") {
          Alert.alert(t.checkUpdates, t.updateReady, [
            { text: t.later, style: "cancel" },
            { text: t.restart, onPress: () => reloadAppForUpdate() },
          ]);
        }
      } else if (status.type === "none") {
        Alert.alert(t.checkUpdates, t.upToDate);
      } else if (status.type === "unsupported") {
        Alert.alert(t.checkUpdates, t.upToDate);
      } else {
        Alert.alert(t.checkUpdates, t.error);
      }
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleRate = () => {
    Haptics.selectionAsync();
    if (Platform.OS === "android") {
      Linking.openURL("market://details?id=com.shitalsurya.LifeLens").catch(() =>
        Linking.openURL(
          "https://play.google.com/store/apps/details?id=com.shitalsurya.LifeLens",
        ),
      );
    } else if (Platform.OS === "ios") {
      Linking.openURL("itms-apps://itunes.apple.com/app/id000000000");
    } else {
      Alert.alert("Rate", "Rating not available on web");
    }
  };

  const handleShare = async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({ message: t.shareMessage });
    } catch {
      /* ignore */
    }
  };

  const handlePrivacy = async () => {
    Haptics.selectionAsync();
    try {
      await WebBrowser.openBrowserAsync(PRIVACY_URL);
    } catch {
      Linking.openURL(PRIVACY_URL);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
      {title}
    </Text>
  );

  const Row = ({
    icon,
    title,
    subtitle,
    right,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    right: React.ReactNode;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      android_ripple={onPress ? { color: colors.muted } : undefined}
      style={[styles.row, { borderBottomColor: colors.border }]}
    >
      <View style={[styles.iconBg, { backgroundColor: colors.secondary }]}>
        {icon}
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + (Platform.OS === "web" ? 10 : 8),
          },
        ]}
      >
        <Text style={styles.headerTitle}>{t.settings}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 100 : 90),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SectionHeader title={t.appearance} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            icon={<Feather name="moon" size={18} color={colors.primary} />}
            title={t.darkMode}
            subtitle={t.darkModeDesc}
            right={
              <Switch
                value={darkMode}
                onValueChange={(v) => {
                  setDarkMode(v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
          <Row
            icon={
              <MaterialCommunityIcons
                name="translate"
                size={18}
                color={colors.primary}
              />
            }
            title={t.language}
            subtitle={
              LANG_OPTIONS.find((l) => l.value === language)?.label ?? language
            }
            right={
              <View style={styles.langPicker}>
                {LANG_OPTIONS.map((opt) => {
                  const isActive = language === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => {
                        setLanguage(opt.value);
                        Haptics.selectionAsync();
                      }}
                      style={[
                        styles.langChip,
                        {
                          backgroundColor: isActive
                            ? colors.primary
                            : colors.secondary,
                          borderColor: isActive ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.langChipText,
                          {
                            color: isActive ? "#ffffff" : colors.primary,
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            }
          />
        </View>

        {/* Dashboard */}
        <SectionHeader title={t.dashboard} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            icon={<MaterialCommunityIcons name="calendar-star" size={18} color={colors.primary} />}
            title={t.showPanchang}
            subtitle={t.showPanchangDesc}
            right={
              <Switch
                value={toggles.showPanchang}
                onValueChange={(v) => {
                  setToggle("showPanchang", v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
          <Row
            icon={<MaterialCommunityIcons name="weather-sunset" size={18} color={colors.primary} />}
            title={t.showMuhurat}
            subtitle={t.showMuhuratDesc}
            right={
              <Switch
                value={toggles.showMuhurat}
                onValueChange={(v) => {
                  setToggle("showMuhurat", v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
          <Row
            icon={<Feather name="bell" size={18} color={colors.primary} />}
            title={t.showFestivalAlerts}
            subtitle={t.showFestivalAlertsDesc}
            right={
              <Switch
                value={toggles.showFestivalAlerts}
                onValueChange={(v) => {
                  setToggle("showFestivalAlerts", v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
          <Row
            icon={<Feather name="zap" size={18} color={colors.primary} />}
            title={t.showDailySuggestions}
            subtitle={t.showDailySuggestionsDesc}
            right={
              <Switch
                value={toggles.showDailySuggestions}
                onValueChange={(v) => {
                  setToggle("showDailySuggestions", v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        {/* Notifications */}
        <SectionHeader title={t.notifications} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            icon={<Feather name="bell" size={18} color={colors.primary} />}
            title={t.dailyNotif}
            subtitle={t.dailyNotifDesc}
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        {/* Widget */}
        <SectionHeader title={t.widget} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            icon={<MaterialCommunityIcons name="widgets" size={18} color={colors.primary} />}
            title={t.widgetAuto}
            subtitle={t.widgetAutoDesc}
            right={
              <Switch
                value={toggles.widgetAutoRefresh}
                onValueChange={(v) => {
                  setToggle("widgetAutoRefresh", v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        {/* Updates */}
        <SectionHeader title={t.updates} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            icon={<Feather name="download-cloud" size={18} color={colors.primary} />}
            title={t.autoUpdate}
            subtitle={t.autoUpdateDesc}
            right={
              <Switch
                value={toggles.autoUpdateEnabled}
                onValueChange={(v) => {
                  setToggle("autoUpdateEnabled", v);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
          <Row
            icon={<Feather name="refresh-cw" size={18} color={colors.primary} />}
            title={t.checkUpdates}
            subtitle={`${t.currentVersion}: v${VERSION_CONFIG.currentVersion}`}
            onPress={handleCheckUpdates}
            right={
              isCheckingUpdate ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
              )
            }
          />
        </View>

        {/* About */}
        <SectionHeader title={t.about} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            icon={<Feather name="star" size={18} color={colors.primary} />}
            title={t.rateApp}
            onPress={handleRate}
            right={<Feather name="chevron-right" size={20} color={colors.mutedForeground} />}
          />
          <Row
            icon={<Feather name="share-2" size={18} color={colors.primary} />}
            title={t.shareApp}
            onPress={handleShare}
            right={<Feather name="chevron-right" size={20} color={colors.mutedForeground} />}
          />
          <Row
            icon={<Feather name="shield" size={18} color={colors.primary} />}
            title={t.privacyPolicy}
            onPress={handlePrivacy}
            right={<Feather name="chevron-right" size={20} color={colors.mutedForeground} />}
          />
          <View style={styles.aboutFooter}>
            <MaterialCommunityIcons
              name="flower-tulip"
              size={36}
              color={colors.primary}
            />
            <Text style={[styles.aboutTitle, { color: colors.foreground }]}>
              {t.appName} 🎉
            </Text>
            <Text style={[styles.aboutVersion, { color: colors.mutedForeground }]}>
              v{VERSION_CONFIG.currentVersion}
            </Text>
            <Text style={[styles.aboutDesc, { color: colors.mutedForeground }]}>
              {t.aboutDesc}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 14, fontFamily: "Inter_500Medium" },
  rowSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  langPicker: { flexDirection: "row", gap: 4, flexShrink: 1 },
  langChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  langChipText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  aboutFooter: {
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  aboutTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  aboutVersion: { fontSize: 12, fontFamily: "Inter_400Regular" },
  aboutDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
});
