import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme";
import BarcodeScannerModal from "../barcode/barcode-camera";
import { styles } from "./styles";

export enum LabelType {
  LABEL = "LABEL",
  BARCODE = "BARCODE",
}

type Props = {
  label?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
  value?: string;
  variant?: "default" | "plain";
  inputStyle?: any;
  labelType?: LabelType;
  onRightIconPress?: () => void;
  disabled?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad" | "number-pad";
};

export default function TextInputComponent({
  label,
  placeholder,
  style,
  onChangeText,
  value,
  variant = "default",
  labelType = LabelType.LABEL,
  inputStyle,
  onRightIconPress,
  disabled = false,
  keyboardType = "default",
}: Props) {
  const { colors } = useTheme();
  const [scannerOpen, setScannerOpen] = useState(false);

  const containerStyle = variant === "plain" ? null : styles.container;

  const config = useMemo(() => {
    const map: Record<LabelType, { icon?: keyof typeof Ionicons.glyphMap; press?: () => void }> = {
      [LabelType.LABEL]: { icon: undefined, press: undefined },
      [LabelType.BARCODE]: {
        icon: "barcode-outline",
        press: () => setScannerOpen(true),
      },
    };

    if (onRightIconPress) {
      return { icon: map[labelType].icon, press: onRightIconPress };
    }

    return map[labelType];
  }, [labelType, onRightIconPress]);

  const hasRightIcon = !!config.icon;

  const handleScanned = useCallback(
    (code: string) => {
      onChangeText?.(code);
    },
    [onChangeText]
  );

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={styles.label(colors)}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input(colors),
            inputStyle,
            hasRightIcon ? styles.inputWithRightIcon : null,
            disabled ? styles.disabled(colors) : null,
          ]}
          placeholder={placeholder || "Digite algo..."}
          placeholderTextColor={colors.textMuted}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
        />

        {hasRightIcon && (
          <Pressable
            onPress={config.press}
            hitSlop={10}
            style={styles.rightIconButton}
          >
            <Ionicons name={config.icon!} size={20} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {labelType === LabelType.BARCODE && (
        <BarcodeScannerModal
          visible={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScanned={handleScanned}
        />
      )}
    </View>
  );
}