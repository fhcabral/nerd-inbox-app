import { layout } from "@/src/constants/layout";
import type { TextStyle, ViewStyle } from "react-native";
import type { ThemeColors } from "../theme/theme";

export const styles = {
  container: {
    margin: 10,
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

  label: (c: ThemeColors): TextStyle => ({
    fontSize: 12,
    color: c.primary,
    marginBottom: 4,
  }),
};
