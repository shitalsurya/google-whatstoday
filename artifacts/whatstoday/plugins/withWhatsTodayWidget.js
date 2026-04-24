/**
 * Expo Config Plugin: WhatsTodayWidget
 *
 * Installs a native Android home-screen widget into the Expo project on
 * `npx expo prebuild`. The widget displays today's date, festival, and
 * insight; tapping it opens the WhatsToday app.
 *
 * What this plugin does:
 *   1. Adds <receiver> + <service> entries for the AppWidgetProvider
 *      to AndroidManifest.xml.
 *   2. Copies widget Kotlin sources, layouts, and metadata XML into the
 *      Android project at prebuild time.
 *   3. Wires a small `WhatsTodayWidget` native module so JS can push
 *      a fresh snapshot to the widget via `services/widgetService.ts`.
 *
 * Note: This plugin is a no-op outside of `expo prebuild` / EAS build.
 * Inside Expo Go (development), the widget code is not bundled but the
 * JS service still persists snapshots to AsyncStorage.
 */

const {
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PACKAGE = "com.shitalsurya.LifeLens";
const WIDGET_DIR_NAME = "widget";

function withWidgetManifest(config) {
  return withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    app.receiver = app.receiver || [];

    const exists = app.receiver.find(
      (r) =>
        r.$ &&
        r.$["android:name"] === `${PACKAGE}.widget.WhatsTodayWidgetProvider`,
    );

    if (!exists) {
      app.receiver.push({
        $: {
          "android:name": `${PACKAGE}.widget.WhatsTodayWidgetProvider`,
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: { "android:name": "android.appwidget.action.APPWIDGET_UPDATE" },
              },
            ],
          },
        ],
        "meta-data": [
          {
            $: {
              "android:name": "android.appwidget.provider",
              "android:resource": "@xml/whatstoday_widget_info",
            },
          },
        ],
      });
    }

    return config;
  });
}

function withWidgetSources(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      const pluginDir = path.join(projectRoot, "plugins", WIDGET_DIR_NAME);

      if (!fs.existsSync(pluginDir)) {
        // Plugin sources not present (eg. running outside repo) — skip.
        return config;
      }

      const javaPackagePath = PACKAGE.replace(/\./g, "/");
      const targets = [
        {
          from: path.join(pluginDir, "WhatsTodayWidgetProvider.kt"),
          to: path.join(
            platformProjectRoot,
            "app/src/main/java",
            javaPackagePath,
            "widget/WhatsTodayWidgetProvider.kt",
          ),
        },
        {
          from: path.join(pluginDir, "WhatsTodayWidgetModule.kt"),
          to: path.join(
            platformProjectRoot,
            "app/src/main/java",
            javaPackagePath,
            "widget/WhatsTodayWidgetModule.kt",
          ),
        },
        {
          from: path.join(pluginDir, "WhatsTodayWidgetPackage.kt"),
          to: path.join(
            platformProjectRoot,
            "app/src/main/java",
            javaPackagePath,
            "widget/WhatsTodayWidgetPackage.kt",
          ),
        },
        {
          from: path.join(pluginDir, "whatstoday_widget.xml"),
          to: path.join(
            platformProjectRoot,
            "app/src/main/res/layout/whatstoday_widget.xml",
          ),
        },
        {
          from: path.join(pluginDir, "whatstoday_widget_info.xml"),
          to: path.join(
            platformProjectRoot,
            "app/src/main/res/xml/whatstoday_widget_info.xml",
          ),
        },
      ];

      for (const t of targets) {
        if (!fs.existsSync(t.from)) continue;
        fs.mkdirSync(path.dirname(t.to), { recursive: true });
        fs.copyFileSync(t.from, t.to);
      }

      return config;
    },
  ]);
}

module.exports = function withWhatsTodayWidget(config) {
  config = withWidgetManifest(config);
  config = withWidgetSources(config);
  return config;
};
