import type { ThemeColors } from "@/src/contexts/theme/theme";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

type Layout = {
  radius: Record<string, number>;
  space: Record<number, number>;
  borderWidth: Record<string, number>;
};

export const styles = (c: ThemeColors, layout: Layout) => {
  const r = layout.radius.md;
  const bw = layout.borderWidth.lg;

  const bigSize = 320; // quadrado grande (ajusta se quiser)

  return {
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    } satisfies ViewStyle,

    reorderBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: layout.radius.md,
      borderWidth: layout.borderWidth.hairline,
      borderColor: c.primary,
      backgroundColor: "transparent",
    } satisfies ViewStyle,

    reorderBtnText: {
      color: c.primary,
    } satisfies TextStyle,

    bigFrame: {
  width: "100%",
  aspectRatio: 1,
  borderRadius: r,
  borderWidth: bw,
  borderColor: c.primary,
  overflow: "hidden",
  backgroundColor: c.surface2,
} satisfies ViewStyle,

bigFrameEmpty: {
  width: "100%",
  aspectRatio: 1,
  borderRadius: r,
  borderWidth: bw,
  borderColor: c.primary,
  backgroundColor: c.surface2,
  alignItems: "center",
  justifyContent: "center",
} satisfies ViewStyle,

    bigImage: {
      width: "100%",
      height: "100%",
    } satisfies ImageStyle,

    deleteBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
    } satisfies ViewStyle,

    primaryBadge: {
      position: "absolute",
      left: 10,
      bottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "rgba(0,0,0,0.55)",
      borderWidth: layout.borderWidth.hairline,
      borderColor: c.primary,
    } satisfies ViewStyle,

    primaryBadgeText: {
      color: "white",
    } satisfies TextStyle,

    modalWrap: {
      flex: 1,
      padding: layout.space[5],
      backgroundColor: c.bg,
    } satisfies ViewStyle,

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: layout.space[2],
      marginTop: layout.space[8],
    } satisfies ViewStyle,

    reorderItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.space[3],
      padding: layout.space[3],
      borderRadius: layout.radius.md,
      borderWidth: layout.borderWidth.hairline,
      borderColor: c.borderStrong,
      backgroundColor: c.surface2,
      marginBottom: layout.space[2],
    } satisfies ViewStyle,

    reorderActive: {
      opacity: 0.85,
      borderColor: c.primary,
    } satisfies ViewStyle,

    reorderThumb: {
      width: 56,
      height: 56,
      borderRadius: layout.radius.sm ?? 10,
      backgroundColor: c.surface,
    } satisfies ImageStyle,

    reorderInfo: {
      flex: 1,
      gap: 2,
    } satisfies ViewStyle,

    reorderDelete: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: layout.borderWidth.hairline,
      borderColor: c.primary,
      backgroundColor: "transparent",
    } satisfies ViewStyle,

    modalFooter: {
      flexDirection: "row",
      gap: layout.space[2],
      paddingTop: layout.space[3],
    } satisfies ViewStyle,
  };
};