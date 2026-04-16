# WhatsToday

## Overview

**WhatsToday** is a standalone React Native Expo app — an Indian calendar (Kalnirnay-inspired) that shows daily Tithi, Nakshatra, festivals, historical facts, motivational quotes, with Marathi/English language toggle.

## Stack

- **Framework**: React Native + Expo (Expo Router v6)
- **Language**: TypeScript
- **Package manager**: npm (standalone Expo project)
- **State**: React Context + AsyncStorage (no backend)
- **Navigation**: Expo Router (file-based, tab navigation)

## Project Structure

The Expo app lives in `artifacts/whatstoday/`:

```
artifacts/whatstoday/
├── app/
│   ├── _layout.tsx          # Root layout with providers (SafeArea, GestureHandler, Query)
│   ├── settings.tsx         # Settings screen (language, dark mode, reminders)
│   └── (tabs)/
│       ├── _layout.tsx      # Tab layout — "Calender" + "What's Today" tabs
│       ├── index.tsx        # Main "What's Today" screen (dark theme, info card)
│       └── calendar.tsx     # Monthly calendar view
├── components/
│   ├── DateStrip.tsx        # Horizontal date picker strip
│   └── ErrorBoundary.tsx    # Error boundary
├── context/
│   └── AppContext.tsx       # Global state (language, darkMode, selectedDate, reminders)
├── data/
│   └── festivals.ts         # Indian calendar data, bilingual (EN/MR), CalendarDay interface
├── services/
│   └── notifications.ts     # Expo Notifications service
├── constants/
│   └── colors.ts            # Saffron/orange Indian-themed palette
└── hooks/
    └── useColors.ts         # Color scheme hook
```

A standalone copy of the app source also lives at the workspace root for easy download.

## Running the App

```bash
cd artifacts/whatstoday
npm run dev      # Run for Replit preview (Expo web)
npm run start    # Run Expo start (iOS/Android/web)
```

Or from root:
```bash
npm run dev
```

## Design Choices

- **Today screen**: Dark background (`#0f0f1a`), white info card, colored section headers:
  - 🇮🇳 Indian Significance — orange
  - 🌍 Global Observance — green  
  - ⏳ On This Day in History — blue/purple
  - 💡 Did you Know? — yellow
- **Calendar screen**: Month grid view with festival dots, panchang details for selected date
- **Tab bar**: Dark background with gold active tint
- **Language**: Full bilingual EN/MR throughout all screens
- **Data**: Local-only (AsyncStorage), no backend
