/**
 * Settings screen: notifications, dark mode, reminders, language.
 */

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  requestNotificationPermission,
  scheduleDailyMorningNotification,
} from "@/services/notifications";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    reminders,
    toggleReminder,
    removeReminder,
    addReminder,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useApp();

  const isMr = language === "mr";
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("08:00");

  const handleNotificationToggle = async (value: boolean) => {
    if (Platform.OS === "web") {
      Alert.alert(isMr ? "उपलब्ध नाही" : "Not Available", isMr ? "वेबवर सूचना उपलब्ध नाहीत" : "Notifications not available on web");
      return;
    }
    if (value) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        await scheduleDailyMorningNotification(
          isMr ? "WhatsToday" : "WhatsToday",
          isMr ? "आजचे पंचांग पहा!" : "Check today's panchang!",
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert(
          isMr ? "परवानगी नाकारली" : "Permission Denied",
          isMr
            ? "सूचनांसाठी परवानगी द्या"
            : "Please grant notification permissions in Settings",
        );
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleAddReminder = () => {
    if (!newReminderTitle.trim()) return;
    const id = `reminder_${Date.now()}`;
    addReminder({
      id,
      title: newReminderTitle,
      titleMr: newReminderTitle,
      time: newReminderTime,
      enabled: true,
      type: "personal",
    });
    setNewReminderTitle("");
    setShowAddReminder(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>{title}</Text>
  );

  const SettingRow = ({
    icon,
    title,
    subtitle,
    right,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    right: React.ReactNode;
  }) => (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
        {icon}
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );

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
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isMr ? "सेटिंग्ज" : "Settings"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SectionHeader title={isMr ? "देखावा" : "Appearance"} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={<Feather name="moon" size={18} color={colors.primary} />}
            title={isMr ? "डार्क मोड" : "Dark Mode"}
            subtitle={isMr ? "गडद थीम वापरा" : "Use dark theme"}
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
          <SettingRow
            icon={<MaterialCommunityIcons name="translate" size={18} color={colors.primary} />}
            title={isMr ? "भाषा" : "Language"}
            subtitle={language === "en" ? "English" : "मराठी"}
            right={
              <Pressable
                onPress={() => {
                  setLanguage(language === "en" ? "mr" : "en");
                  Haptics.selectionAsync();
                }}
                style={[styles.langToggle, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              >
                <Text style={[styles.langToggleText, { color: colors.primary }]}>
                  {language === "en" ? "मराठी" : "English"}
                </Text>
              </Pressable>
            }
          />
        </View>

        {/* Notifications */}
        <SectionHeader title={isMr ? "सूचना" : "Notifications"} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={<Feather name="bell" size={18} color={colors.primary} />}
            title={isMr ? "दैनिक सूचना" : "Daily Notifications"}
            subtitle={isMr ? "सकाळी ८ वाजता पंचांग सूचना" : "Morning panchang at 8 AM"}
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

        {/* Reminders */}
        <SectionHeader title={isMr ? "स्मरण" : "Reminders"} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {reminders.map((reminder, index) => (
            <View
              key={reminder.id}
              style={[
                styles.reminderRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: index < reminders.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="clock" size={16} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {isMr ? reminder.titleMr : reminder.title}
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>
                  {reminder.time}
                </Text>
              </View>
              <Switch
                value={reminder.enabled}
                onValueChange={() => {
                  toggleReminder(reminder.id);
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
              {reminder.id !== "default_morning" && (
                <Pressable
                  onPress={() => removeReminder(reminder.id)}
                  style={styles.deleteBtn}
                >
                  <Feather name="trash-2" size={16} color={colors.destructive} />
                </Pressable>
              )}
            </View>
          ))}

          {/* Add Reminder */}
          {showAddReminder ? (
            <View style={[styles.addReminderForm, { borderTopColor: colors.border }]}>
              <TextInput
                style={[
                  styles.reminderInput,
                  {
                    backgroundColor: colors.muted,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={isMr ? "स्मरणाचे नाव..." : "Reminder title..."}
                placeholderTextColor={colors.mutedForeground}
                value={newReminderTitle}
                onChangeText={setNewReminderTitle}
              />
              <TextInput
                style={[
                  styles.reminderInput,
                  {
                    backgroundColor: colors.muted,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="HH:MM (e.g. 08:00)"
                placeholderTextColor={colors.mutedForeground}
                value={newReminderTime}
                onChangeText={setNewReminderTime}
                keyboardType="numeric"
              />
              <View style={styles.addReminderActions}>
                <Pressable
                  onPress={() => setShowAddReminder(false)}
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>
                    {isMr ? "रद्द करा" : "Cancel"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleAddReminder}
                  style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.saveBtnText}>
                    {isMr ? "जतन करा" : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowAddReminder(true)}
              style={[styles.addBtn, { borderTopColor: colors.border }]}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={[styles.addBtnText, { color: colors.primary }]}>
                {isMr ? "नवीन स्मरण जोडा" : "Add Reminder"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* About */}
        <SectionHeader title={isMr ? "माहिती" : "About"} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.aboutContent}>
            <MaterialCommunityIcons name="flower-tulip" size={40} color={colors.primary} />
            <Text style={[styles.aboutTitle, { color: colors.foreground }]}>WhatsToday</Text>
            <Text style={[styles.aboutVersion, { color: colors.mutedForeground }]}>
              v1.0.0
            </Text>
            <Text style={[styles.aboutDesc, { color: colors.mutedForeground }]}>
              {isMr
                ? "त्योहार, तिथि, खास तारीखों और रिमाइंडर्स के लिए नेक्स्ट-जन स्मार्ट नेक्स्ट-जन स्मार्ट दिनदर्शिका"
                : "The next-gen smart calendar for festivals, tithi, special dates, and reminders. Stay in sync with the cosmic rhythm!"}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  scrollContent: {
    paddingTop: 20,
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  langToggle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  langToggleText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 4,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  addBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  addReminderForm: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
  },
  reminderInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  addReminderActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  aboutContent: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  aboutTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  aboutVersion: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  aboutDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
  },
});
