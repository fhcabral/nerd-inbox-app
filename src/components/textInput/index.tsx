import { StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme";
import { styles } from "./styles";

type Props = {
  label?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
  value?: string;
  variant?: "default" | "plain"; // 👈 novo
  inputStyle?: any; // se quiser refinar depois
};

export default function TextInputComponent({
  label,
  placeholder,
  style,
  onChangeText,
  value,
  variant = "default",
  inputStyle,
}: Props) {
  const { colors } = useTheme();

  const containerStyle = variant === "plain" ? null : styles.container;

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={styles.label(colors)}>{label}</Text>}
      <TextInput
        style={[styles.input(colors), inputStyle]}
        placeholder={placeholder || "Digite algo..."}
        placeholderTextColor={colors.textMuted}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}
