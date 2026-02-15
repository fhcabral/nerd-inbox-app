import { ReactNode } from "react";
import { Text as RNText, StyleProp, TextStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

type TextVariant =
  | "display"
  | "heading"
  | "body"
  | "bodyStrong"
  | "mono"
  | "caption";

type TextProps = {
  children: ReactNode;
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
};

export default function Text({
  children,
  variant = "body",
  style,
}: TextProps) {
  const { colors, typography } = useTheme();

  const variantStyle: TextStyle =
    variant === "display"
      ? {
          fontFamily: typography.fontFamily.display,
          fontSize: typography.size["3xl"],
          lineHeight: typography.lineHeight["3xl"],
        }
      : variant === "heading"
      ? {
          fontFamily: typography.fontFamily.heading,
          fontSize: typography.size.xl,
          lineHeight: typography.lineHeight.xl,
        }
      : variant === "bodyStrong"
      ? {
          fontFamily: typography.fontFamily.bodyStrong,
          fontSize: typography.size.md,
          lineHeight: typography.lineHeight.md,
        }
      : variant === "mono"
      ? {
          fontFamily: typography.fontFamily.mono,
          fontSize: typography.size.sm,
          lineHeight: typography.lineHeight.sm,
        }
      : variant === "caption"
      ? {
          fontFamily: typography.fontFamily.body,
          fontSize: typography.size.xs,
          lineHeight: typography.lineHeight.xs,
        }
      : {
          fontFamily: typography.fontFamily.body,
          fontSize: typography.size.md,
          lineHeight: typography.lineHeight.md,
        };

  return (
    <RNText
      style={[
        { color: colors.text },
        variantStyle,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
