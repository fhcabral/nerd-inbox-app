import type { ThemeColors } from "@/src/contexts/theme/theme";
import type { TextStyle } from "react-native";

type Layout = {
  radius: Record<string, number>;
  space: Record<number, number>;
  borderWidth: Record<string, number>;
};

export const styles = {
  label: (c: ThemeColors, layout: Layout): TextStyle => ({
    color: c.primary,
    marginBottom: layout.space[1],
  }),

  input: (c: ThemeColors, layout: Layout): TextStyle => ({
    minHeight: 96,
    borderRadius: layout.radius.md,
    paddingHorizontal: layout.space[4],
    paddingVertical: layout.space[3],
    borderWidth: layout.borderWidth.hairline,
    borderColor: c.primary,
    backgroundColor: c.bg,
    color: c.text,
    fontSize: 16,
    textAlignVertical: "top" as any, // RN às vezes enche o saco com typing aqui
  }),

  loading: {
    opacity: 0.6,
  } satisfies TextStyle,

  disabled: (c: ThemeColors): TextStyle => ({
    backgroundColor: c.surface,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  }),
};