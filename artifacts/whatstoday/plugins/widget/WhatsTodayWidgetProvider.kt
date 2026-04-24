package com.shitalsurya.LifeLens.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.widget.RemoteViews
import com.shitalsurya.LifeLens.R
import com.shitalsurya.LifeLens.MainActivity
import org.json.JSONObject

/**
 * Home-screen widget for "What's Today 🎉".
 *
 * Reads the latest snapshot from SharedPreferences (key WIDGET_DATA_KEY,
 * written by the JS-side widgetService.ts) and renders date / festival /
 * insight. Tapping opens MainActivity.
 *
 * Auto-refresh is configured via `whatstoday_widget_info.xml`
 * (updatePeriodMillis = 1 day). For more granular refresh, schedule an
 * AlarmManager from the widgetService at app open time.
 */
class WhatsTodayWidgetProvider : AppWidgetProvider() {

    companion object {
        const val PREFS_NAME = "WhatsTodayWidgetPrefs"
        const val WIDGET_DATA_KEY = "widget_data"

        fun updateAllWidgets(context: Context) {
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(
                ComponentName(context, WhatsTodayWidgetProvider::class.java)
            )
            for (id in ids) {
                renderWidget(context, mgr, id)
            }
        }

        private fun renderWidget(
            context: Context,
            manager: AppWidgetManager,
            widgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.whatstoday_widget)

            val prefs: SharedPreferences =
                context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val raw = prefs.getString(WIDGET_DATA_KEY, null)

            var displayDate = "What's Today 🎉"
            var festival = "Open the app to view today's panchang"
            var insight = ""

            if (raw != null) {
                try {
                    val json = JSONObject(raw)
                    displayDate = json.optString("displayDate", displayDate)
                    val f = json.optString("festival", "")
                    if (f.isNotEmpty() && f != "null") festival = f
                    insight = json.optString("insight", "")
                } catch (_: Exception) {
                    // ignore malformed snapshot
                }
            }

            views.setTextViewText(R.id.widget_date, displayDate)
            views.setTextViewText(R.id.widget_festival, festival)
            views.setTextViewText(R.id.widget_insight, insight)

            val openIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                openIntent,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            manager.updateAppWidget(widgetId, views)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        for (id in appWidgetIds) {
            renderWidget(context, appWidgetManager, id)
        }
    }
}
