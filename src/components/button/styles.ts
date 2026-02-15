import { layout } from "@/src/constants/layout";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import { ThemeColors } from "../../contexts/theme/theme";

type Variant = "primary" | "secondary" | "ghost";

export const styles = {
  base: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: layout.radius.md,
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,

  pressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.4,
  } satisfies ViewStyle,

  variant: (c: ThemeColors) =>
    StyleSheet.create<Record<Variant, ViewStyle>>({
      primary: {
        backgroundColor: c.primary,
        shadowColor: c.glow,
        shadowOpacity: 0.55,
        shadowRadius: 16,
        elevation: 8,
      },
      secondary: {
        backgroundColor: c.surface,
        borderWidth: layout.borderWidth.md,
        borderColor: c.borderStrong,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    }),

  disabled: (c: ThemeColors): ViewStyle => ({
    backgroundColor: c.surface,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  }),

  textBase: {
    marginRight: layout.space[2]
  },
  textPrimary: (c: ThemeColors): TextStyle => ({
    color: c.text,
    fontSize: 16,
    fontWeight: "600",
    ...styles.textBase
  }),

  textSecondary: (c: ThemeColors): TextStyle => ({
    color: c.text,
    fontSize: 16,
    fontWeight: "600",
     ...styles.textBase
  }),

  textGhost: (c: ThemeColors): TextStyle => ({
    color: c.primary,
    fontSize: 16,
    fontWeight: "600",
     ...styles.textBase
  }),
};
