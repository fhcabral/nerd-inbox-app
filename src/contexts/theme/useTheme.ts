import { useThemeContext } from "@/src/contexts/theme/themeProvider";
import { theme } from "./theme";

export function useTheme() {
  const { mode, resolvedMode, colors, setMode } = useThemeContext();

  return {
    mode,
    resolvedMode,
    colors,
    setMode,

    primitives: theme.primitives,
    layout: theme.layout,
    typography: theme.typography,
    effects: theme.effects,
  };
}

export type UseThemeReturn = ReturnType<typeof useTheme>;
