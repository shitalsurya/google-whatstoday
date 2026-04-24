package com.shitalsurya.LifeLens.widget

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Bridges JS calls (services/widgetService.ts) to the native widget so
 * the latest snapshot is persisted to SharedPreferences AND every
 * mounted widget is repainted immediately.
 */
class WhatsTodayWidgetModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WhatsTodayWidget"

    @ReactMethod
    fun updateWidget(snapshotJson: String, promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences(
                WhatsTodayWidgetProvider.PREFS_NAME,
                Context.MODE_PRIVATE,
            )
            prefs.edit()
                .putString(WhatsTodayWidgetProvider.WIDGET_DATA_KEY, snapshotJson)
                .apply()

            WhatsTodayWidgetProvider.updateAllWidgets(reactContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_UPDATE_FAILED", e)
        }
    }
}
