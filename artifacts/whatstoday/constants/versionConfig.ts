/**
 * Centralized version metadata for WhatsToday.
 * `currentVersion` is the build the user is running.
 * `minimumSupportedVersion` is the floor below which a force-update is required.
 * `latestVersion` is the newest version known to the binary; the auto-update
 *  service can update this dynamically by querying a remote manifest in future.
 */

export const VERSION_CONFIG = {
  currentVersion: "1.1.0",
  minimumSupportedVersion: "1.0.0",
  latestVersion: "1.1.0",

  // Storage keys for persisted update state
  storageKeys: {
    lastSeenWhatsNew: "@whatstoday_last_whatsnew_version",
    lastUpdateCheck: "@whatstoday_last_update_check",
    autoUpdateEnabled: "@whatstoday_auto_update_enabled",
  },

  whatsNew: {
    "1.1.0": {
      en: [
        "📱 Brand-new modern Home dashboard",
        "🌅 Daily key timings: Sunrise, Sunset, Rahu Kaal, Brahma & Abhijit Muhurat",
        "🎉 Festival alerts and auspicious-day badge",
        "⚡ Faster performance and smoother scrolling",
        "📲 Android Home Screen widget support",
        "🌐 हिंदी language support added",
      ],
      mr: [
        "📱 नवीन आधुनिक होम डॅशबोर्ड",
        "🌅 दैनिक मुख्य वेळा: सूर्योदय, सूर्यास्त, राहू काळ, ब्रह्म व अभिजित मुहूर्त",
        "🎉 सण सूचना आणि शुभ दिवस बॅज",
        "⚡ अधिक वेगवान कामगिरी आणि सहज स्क्रोल",
        "📲 Android Home Screen widget सपोर्ट",
        "🌐 हिंदी भाषा जोडली",
      ],
      hi: [
        "📱 नया आधुनिक होम डैशबोर्ड",
        "🌅 दैनिक मुख्य समय: सूर्योदय, सूर्यास्त, राहु काल, ब्रह्म व अभिजीत मुहूर्त",
        "🎉 त्यौहार सूचना और शुभ दिवस बैज",
        "⚡ तेज़ प्रदर्शन और स्मूथ स्क्रॉलिंग",
        "📲 Android Home Screen widget सपोर्ट",
        "🌐 हिंदी भाषा जोड़ी गई",
      ],
    },
  } as Record<string, { en: string[]; mr: string[]; hi: string[] }>,
};

/** Compare two semantic versions — returns -1, 0, or 1. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}
