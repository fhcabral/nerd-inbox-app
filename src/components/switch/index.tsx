import type { ThemeColors } from "@/src/contexts/theme/theme";
import { Switch as SwitchRn } from "react-native";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ThemeColors;
}

export default function Switch({ value, onValueChange, colors }: SwitchProps) {
  return (
    <SwitchRn
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: colors.border,
        true: colors.primary,
      }}
      thumbColor={value ? colors.accent : colors.bg}
    />
  );
}
