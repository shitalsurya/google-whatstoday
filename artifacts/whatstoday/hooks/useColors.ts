import { useColorScheme } from "react-native";
import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 * Respects the app's dark mode setting from AppContext when available.
 */
export function useColors() {
  const scheme = useColorScheme();
  const palette =
    scheme === "dark" && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return { ...palette, radius: colors.radius };
}
