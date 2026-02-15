import { StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme";
import { styles } from "./styles";

type Props = {
  label?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
  value?: string;
};

export default function TextInputComponent({ label, placeholder, style, onChangeText, value }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label(colors)}>{label}</Text>}
      <TextInput
        style={styles.input(colors)}
        placeholder={placeholder || "Digite algo..."}
        placeholderTextColor={colors.textMuted}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}
