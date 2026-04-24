# WhatsToday — Android Widget & OTA Update Setup

This document walks the maintainer through enabling the home-screen widget
and over-the-air update channel after the standard Expo Go workflow.

## 1. Android Home-Screen Widget

The widget is implemented as a config plugin under `plugins/`. It is
**not active in Expo Go** — Expo Go cannot load native widget code.
To ship it to users you must produce an EAS build.

### Files
- `plugins/withWhatsTodayWidget.js` — Expo config plugin that wires the
  Manifest receiver and copies native sources during prebuild.
- `plugins/widget/WhatsTodayWidgetProvider.kt` — `AppWidgetProvider`.
- `plugins/widget/WhatsTodayWidgetModule.kt` — JS↔native bridge.
- `plugins/widget/WhatsTodayWidgetPackage.kt` — React Native package.
- `plugins/widget/whatstoday_widget.xml` — widget layout.
- `plugins/widget/whatstoday_widget_info.xml` — widget metadata
  (refresh interval = 24h).

### Steps to enable
1. Ensure `app.json > expo.plugins` includes `"./plugins/withWhatsTodayWidget"`
   (already present).
2. Run `npx expo prebuild --platform android --clean` from
   `artifacts/whatstoday/`. This generates `android/` and copies the
   native widget sources.
3. Register the package in `android/app/src/main/java/com/shitalsurya/LifeLens/MainApplication.kt`
   if Expo autolinking does not pick it up automatically:
   ```kotlin
   override fun getPackages(): List<ReactPackage> {
       val packages = PackageList(this).packages
       packages.add(com.shitalsurya.LifeLens.widget.WhatsTodayWidgetPackage())
       return packages
   }
   ```
4. Build with EAS:
   ```bash
   eas build --platform android --profile production
   ```
5. After install, long-press the home screen → Widgets → "What's Today 🎉"
   → drag onto the screen.

### Auto-refresh
The widget refreshes every 24 hours via `updatePeriodMillis` in
`whatstoday_widget_info.xml`. The JS app *also* re-pushes a fresh
snapshot every time the home screen renders (see
`services/widgetService.ts → updateWidgetData`), so the widget is
always in sync the moment the user opens the app.

## 2. OTA Updates (`expo-updates`)

The app ships with `services/updateService.ts` which silently checks for
updates on every cold start when `Auto Update Enabled` is on (Settings →
Updates). When an update is downloaded the user is prompted to restart.

### Steps to enable
1. Install `expo-updates`:
   ```bash
   cd artifacts/whatstoday
   npx expo install expo-updates
   ```
2. Configure your project on EAS:
   ```bash
   eas update:configure
   ```
   This adds a `runtimeVersion` and `updates.url` field to `app.json`
   automatically.
3. Publish updates:
   ```bash
   eas update --branch production --message "What's New"
   ```
4. To force a critical update, bump `minimumSupportedVersion` in
   `constants/versionConfig.ts` and ship a new EAS build.

### What's New modal
Whenever `currentVersion` (in `constants/versionConfig.ts`) is bumped,
the next launch will surface the "What's New" modal with localized
release notes (EN / MR / HI). After dismissing, the user won't see it
again until the next version bump.
