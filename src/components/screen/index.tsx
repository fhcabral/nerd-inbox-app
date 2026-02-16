import { ReactNode } from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "../../contexts/theme/useTheme";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { colors, layout } = useTheme();

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[
        {
          flexGrow: 1,
          backgroundColor: colors.bg,
          paddingHorizontal: layout.screen.padding,
        },
        style,
      ]}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === "ios" ? 12 : 24}
      overScrollMode="never"
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
