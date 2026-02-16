import { useTheme } from "@/src/contexts/theme/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";
import TextInputComponent from "../textInput";

type SearchProps = {
  label?: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
};

export default function SearchBar({ label, placeholder, onChangeText, value }: SearchProps) {
  const { colors, layout } = useTheme();

  return (
    <View style={{ marginBottom: layout.space[4] }}>
      {label && (
        <Text style={{ fontSize: 12, color: colors.primary, marginBottom: 4 }}>
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: layout.borderWidth.lg,
          borderColor: colors.borderStrong,
          borderRadius: layout.radius.md,
          overflow: "hidden",
          height: 48,
        }}
      >
        <View
          style={{
            height: "100%",
            paddingHorizontal: 12,
            alignItems: "center",
            justifyContent: "center",
            borderRightWidth: layout.borderWidth.lg,
            borderRightColor: colors.borderStrong,
            backgroundColor: colors.surface ?? "transparent",
          }}
        >
          <Feather name="search" color={colors.primary} size={20} />
        </View>

        <View style={{ flex: 1 }}>
          <TextInputComponent
            variant="plain"
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            inputStyle={{
              borderWidth: 0, 
              height: 48,
              paddingHorizontal: 12,
            }}
          />
        </View>
      </View>
    </View>
  );
}
