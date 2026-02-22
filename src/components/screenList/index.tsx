import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenList({ children, style }: ScreenProps) {
  const { colors, layout } = useTheme();

  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.bg, paddingHorizontal: layout.screen.padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}