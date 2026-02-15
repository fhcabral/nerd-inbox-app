import { useColorScheme } from "react-native";
import { theme, type ThemeColors } from "./theme";

export function useTheme() {
  const scheme = useColorScheme();
  const mode = scheme === "dark" ? "dark" : "light";

  const colors: ThemeColors = theme.modes[mode];

  return {
    mode,
    colors,
    primitives: theme.primitives,
    layout: theme.layout,
    typography: theme.typography,
    effects: theme.effects,
  };
}

export type UseThemeReturn = ReturnType<typeof useTheme>;
