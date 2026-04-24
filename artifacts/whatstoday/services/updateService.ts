/**
 * Update Service — wraps `expo-updates` with safe fallbacks.
 *
 * In Expo Go and on web, `expo-updates` is a no-op. The service is designed
 * to gracefully degrade and never throw at startup.
 *
 * Use cases:
 *  • Silent background OTA check on app open
 *  • Manual "Check for updates" from Settings
 *  • Force-update support via `versionConfig.minimumSupportedVersion`
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  VERSION_CONFIG,
  compareVersions,
} from "@/constants/versionConfig";

export type UpdateStatus =
  | { type: "none" }
  | { type: "available"; manifestVersion?: string }
  | { type: "downloaded" }
  | { type: "error"; message: string }
  | { type: "unsupported" };

type UpdatesLike = {
  checkForUpdateAsync: () => Promise<{ isAvailable: boolean; manifest?: any }>;
  fetchUpdateAsync: () => Promise<unknown>;
  reloadAsync: () => Promise<void>;
};
let UpdatesModule: UpdatesLike | null = null;
function getUpdates(): UpdatesLike | null {
  if (UpdatesModule !== null) return UpdatesModule;
  if (Platform.OS === "web") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    UpdatesModule = require("expo-updates") as UpdatesLike;
    return UpdatesModule;
  } catch {
    return null;
  }
}

/**
 * Check for an OTA update. Returns the new status without applying it.
 * Safe to call repeatedly. Errors are swallowed and returned as `{type:"error"}`.
 */
export async function checkForOtaUpdate(): Promise<UpdateStatus> {
  const Updates = getUpdates();
  if (!Updates) return { type: "unsupported" };
  try {
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) {
      return { type: "available", manifestVersion: (result as any).manifest?.id };
    }
    return { type: "none" };
  } catch (err: any) {
    return { type: "error", message: err?.message ?? "Update check failed" };
  } finally {
    try {
      await AsyncStorage.setItem(
        VERSION_CONFIG.storageKeys.lastUpdateCheck,
        String(Date.now()),
      );
    } catch {
      /* ignore */
    }
  }
}

/**
 * Download and stage the latest OTA bundle for next launch.
 * Returns `{type: "downloaded"}` on success, `{type:"error"}` otherwise.
 */
export async function downloadOtaUpdate(): Promise<UpdateStatus> {
  const Updates = getUpdates();
  if (!Updates) return { type: "unsupported" };
  try {
    await Updates.fetchUpdateAsync();
    return { type: "downloaded" };
  } catch (err: any) {
    return { type: "error", message: err?.message ?? "Download failed" };
  }
}

/**
 * Apply a downloaded update by reloading the app.
 * Caller should typically prompt the user before invoking this.
 */
export async function reloadAppForUpdate(): Promise<void> {
  const Updates = getUpdates();
  if (!Updates) return;
  try {
    await Updates.reloadAsync();
  } catch {
    /* ignore */
  }
}

/**
 * Background check + auto-download.
 * Returns true if an update was downloaded and is ready to be applied.
 * Honors the user's "Auto Update Enabled" preference.
 */
export async function silentBackgroundCheck(): Promise<boolean> {
  try {
    const enabled = await AsyncStorage.getItem(
      VERSION_CONFIG.storageKeys.autoUpdateEnabled,
    );
    if (enabled === "false") return false;
  } catch {
    /* ignore */
  }
  const status = await checkForOtaUpdate();
  if (status.type !== "available") return false;
  const dl = await downloadOtaUpdate();
  return dl.type === "downloaded";
}

/**
 * Force-update verdict. Compare currently running version against
 * `minimumSupportedVersion`. When the running version is older, the app
 * should display a blocking modal and refuse to continue without updating.
 */
export function isForceUpdateRequired(): boolean {
  return (
    compareVersions(
      VERSION_CONFIG.currentVersion,
      VERSION_CONFIG.minimumSupportedVersion,
    ) < 0
  );
}

/**
 * Whether to show the "What's New" modal on this launch.
 * Compares `lastSeenWhatsNew` against `currentVersion`.
 */
export async function shouldShowWhatsNew(): Promise<boolean> {
  try {
    const last = await AsyncStorage.getItem(
      VERSION_CONFIG.storageKeys.lastSeenWhatsNew,
    );
    if (!last) return true;
    return compareVersions(VERSION_CONFIG.currentVersion, last) > 0;
  } catch {
    return false;
  }
}

export async function markWhatsNewSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      VERSION_CONFIG.storageKeys.lastSeenWhatsNew,
      VERSION_CONFIG.currentVersion,
    );
  } catch {
    /* ignore */
  }
}

/** Returns the currently running runtime version string. */
export function getCurrentVersion(): string {
  return VERSION_CONFIG.currentVersion;
}
