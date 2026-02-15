import { useTheme } from "@/src/contexts/theme/useTheme";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./styles";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  style,
  icon
}: ButtonProps) {
  const { colors } = useTheme();

  const textStyle =
    variant === "primary"
      ? styles.textPrimary(colors)
      : variant === "secondary"
      ? styles.textSecondary(colors)
      : styles.textGhost(colors);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }): StyleProp<ViewStyle> => [
        styles.base,
        styles.variant(colors)[variant],
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled(colors) : null,
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={textStyle}>{title}</Text>
        {icon && icon}  
      </View>
    </Pressable>
  );
}
