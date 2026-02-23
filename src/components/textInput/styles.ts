import { layout } from "@/src/constants/layout";
import type { TextStyle, ViewStyle } from "react-native";
import type { ThemeColors } from "../../contexts/theme/theme";

export const styles = {
  container: {
    flex: 1,
  } satisfies ViewStyle,

  label: (c: ThemeColors): TextStyle => ({
    fontSize: 12,
    color: c.primary,
    marginBottom: 4,
  }),

  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  } satisfies ViewStyle,

  input: (c: ThemeColors): TextStyle => ({
    height: 48,
    borderWidth: layout.borderWidth.lg,
    borderColor: c.borderStrong,
    borderRadius: layout.radius.md,
    paddingHorizontal: 12,
    fontSize: 16,
    color: c.text,
    backgroundColor: "transparent",
  }),
  disabled: (c: ThemeColors): ViewStyle => ({
    backgroundColor: c.surface,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  }),

  inputWithRightIcon: {
    paddingRight: 44,
  } satisfies TextStyle,

  rightIconButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  } satisfies ViewStyle,
};