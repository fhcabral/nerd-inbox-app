import { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { colors, layout } = useTheme();

  return (
    <KeyboardAvoidingView>
      <ScrollView>
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
      </ScrollView >
    </KeyboardAvoidingView>
  );
}
