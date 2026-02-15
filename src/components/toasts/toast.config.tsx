import React from "react";
import type { ToastConfig } from "react-native-toast-message";
import { BaseToast } from "react-native-toast-message";
import type { UseThemeReturn } from "../theme/useTheme";

function buildToast(
  theme: UseThemeReturn,
  accentColor: string,
  variant: "success" | "error" | "info"
) {
  const { colors, typography } = theme;

  const bg = colors.elevated ?? colors.surface;

  return (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: bg,
        borderLeftColor: accentColor,
        borderLeftWidth: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderStrong ?? colors.border,

        shadowColor: accentColor,
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 14,
      }}
      text1Style={{
        fontSize: typography.size.md,
        lineHeight: typography.lineHeight.md,
        fontWeight: "700",
        color: colors.text,
      }}
      text2Style={{
        fontSize: typography.size.xs,
        lineHeight: typography.lineHeight.sm,
        fontWeight: "500",
        color: colors.text2,
      }}
    />
  );
}

export function makeToastConfig(theme: UseThemeReturn): ToastConfig {
  const { colors } = theme;

  return {
    success: buildToast(theme, colors.accent, "success"),
    error: buildToast(theme, colors.error, "error"),
    info: buildToast(theme, colors.primary, "info"),
  };
}
