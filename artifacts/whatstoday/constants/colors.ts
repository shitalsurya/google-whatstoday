/**
 * WhatsToday color palette — Indian calendar aesthetic.
 * Inspired by Kalnirnay's warm saffron + Google's clean material design.
 */

const colors = {
  light: {
    text: "#1a1a2e",
    tint: "#e05c1a",

    background: "#fafaf8",
    foreground: "#1a1a2e",

    card: "#ffffff",
    cardForeground: "#1a1a2e",

    // Saffron/orange primary — Indian festive warmth
    primary: "#e05c1a",
    primaryForeground: "#ffffff",

    // Soft secondary
    secondary: "#fff3e8",
    secondaryForeground: "#7a3a0a",

    // Muted
    muted: "#f5f0eb",
    mutedForeground: "#8a7a70",

    // Accent — gold
    accent: "#f5a623",
    accentForeground: "#ffffff",

    // Festival highlight — deep maroon
    festivalColor: "#8b1a2a",
    festivalBackground: "#fff0f2",

    // Nakshatra/Tithi info chip
    infoColor: "#1a4a8b",
    infoBackground: "#eef3ff",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    border: "#ede8e0",
    input: "#ede8e0",

    // Gradient stops for the main card
    gradientStart: "#fff8f0",
    gradientEnd: "#ffeedd",

    // Header gradient
    headerStart: "#e05c1a",
    headerEnd: "#f5a623",

    shadow: "rgba(180, 90, 30, 0.12)",
  },

  dark: {
    text: "#f5f0eb",
    tint: "#f5a623",

    background: "#1a1208",
    foreground: "#f5f0eb",

    card: "#2a1e0e",
    cardForeground: "#f5f0eb",

    primary: "#f5a623",
    primaryForeground: "#1a1208",

    secondary: "#3a2810",
    secondaryForeground: "#f5c87a",

    muted: "#2a1e0e",
    mutedForeground: "#a08060",

    accent: "#e05c1a",
    accentForeground: "#ffffff",

    festivalColor: "#ff8fa3",
    festivalBackground: "#3a0a12",

    infoColor: "#90b8ff",
    infoBackground: "#0a1a3a",

    destructive: "#f87171",
    destructiveForeground: "#1a0808",

    border: "#3a2810",
    input: "#3a2810",

    gradientStart: "#2a1e0e",
    gradientEnd: "#1a1208",

    headerStart: "#c04a0e",
    headerEnd: "#e08010",

    shadow: "rgba(0, 0, 0, 0.4)",
  },

  radius: 16,
};

export default colors;
