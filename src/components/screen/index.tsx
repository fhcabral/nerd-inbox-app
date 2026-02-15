import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { colors, layout } = useTheme();

  return (
    <View
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
    </View>
  );
}
