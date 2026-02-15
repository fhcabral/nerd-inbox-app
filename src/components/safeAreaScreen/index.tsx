import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";

type SafeScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SafeScreen({ children, style }: SafeScreenProps) {
  const { colors, layout } = useTheme();

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: colors.bg,
          paddingHorizontal: layout.screen.padding,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
