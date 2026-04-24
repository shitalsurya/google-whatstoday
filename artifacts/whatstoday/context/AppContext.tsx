/**
 * AppContext: Global state for language, reminders, dark mode, selected date,
 * and feature toggles for the modern dashboard.
 * Persisted to AsyncStorage for cross-session consistency.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "en" | "mr" | "hi";

export interface Reminder {
  id: string;
  title: string;
  titleMr: string;
  time: string; // "HH:MM"
  enabled: boolean;
  date?: string; // YYYY-MM-DD if for a specific date
  type: "festival" | "personal";
}

export interface FeatureToggles {
  showPanchang: boolean;
  showMuhurat: boolean;
  showFestivalAlerts: boolean;
  showDailySuggestions: boolean;
  widgetAutoRefresh: boolean;
  autoUpdateEnabled: boolean;
}

const DEFAULT_TOGGLES: FeatureToggles = {
  showPanchang: true,
  showMuhurat: true,
  showFestivalAlerts: true,
  showDailySuggestions: true,
  widgetAutoRefresh: true,
  autoUpdateEnabled: true,
};

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  toggles: FeatureToggles;
  setToggle: <K extends keyof FeatureToggles>(
    key: K,
    value: FeatureToggles[K],
  ) => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEYS = {
  LANGUAGE: "@whatstoday_language",
  DARK_MODE: "@whatstoday_dark_mode",
  REMINDERS: "@whatstoday_reminders",
  NOTIFICATIONS: "@whatstoday_notifications",
  TOGGLES: "@whatstoday_toggles",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [darkMode, setDarkModeState] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "default_morning",
      title: "Good Morning! Check today's festival & calendar",
      titleMr: "सुप्रभात! आजचा सण आणि पंचांग पहा",
      time: "08:00",
      enabled: true,
      type: "personal",
    },
  ]);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [toggles, setTogglesState] = useState<FeatureToggles>(DEFAULT_TOGGLES);

  // Load persisted state
  useEffect(() => {
    const loadState = async () => {
      try {
        const [lang, dark, storedReminders, notifs, storedToggles] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
            AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
            AsyncStorage.getItem(STORAGE_KEYS.REMINDERS),
            AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
            AsyncStorage.getItem(STORAGE_KEYS.TOGGLES),
          ]);
        if (lang === "en" || lang === "mr" || lang === "hi") {
          setLanguageState(lang);
        }
        if (dark !== null) setDarkModeState(dark === "true");
        if (storedReminders) setReminders(JSON.parse(storedReminders));
        if (notifs !== null) setNotificationsEnabledState(notifs === "true");
        if (storedToggles) {
          try {
            const parsed = JSON.parse(storedToggles);
            setTogglesState({ ...DEFAULT_TOGGLES, ...parsed });
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        // Ignore storage errors
      }
    };
    loadState();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  const setDarkMode = useCallback(async (dark: boolean) => {
    setDarkModeState(dark);
    await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, String(dark));
  }, []);

  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, String(enabled));
  }, []);

  const addReminder = useCallback(
    async (reminder: Reminder) => {
      const updated = [...reminders, reminder];
      setReminders(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    },
    [reminders],
  );

  const toggleReminder = useCallback(
    async (id: string) => {
      const updated = reminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r,
      );
      setReminders(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    },
    [reminders],
  );

  const removeReminder = useCallback(
    async (id: string) => {
      const updated = reminders.filter((r) => r.id !== id);
      setReminders(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    },
    [reminders],
  );

  const setToggle = useCallback(
    async <K extends keyof FeatureToggles>(
      key: K,
      value: FeatureToggles[K],
    ) => {
      const updated = { ...toggles, [key]: value };
      setTogglesState(updated);
      await AsyncStorage.setItem(
        STORAGE_KEYS.TOGGLES,
        JSON.stringify(updated),
      );
    },
    [toggles],
  );

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        selectedDate,
        setSelectedDate,
        reminders,
        addReminder,
        toggleReminder,
        removeReminder,
        notificationsEnabled,
        setNotificationsEnabled,
        toggles,
        setToggle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
