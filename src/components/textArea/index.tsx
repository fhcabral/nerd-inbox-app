import { useTheme } from "@/src/contexts/theme/useTheme";
import { TextInput, View } from "react-native";
import Text from "../text";
import { styles } from "./styles";

type TextAreaProps = {
  description: string;
  setDescription: (text: string) => void;
  loading?: boolean;
  saving?: boolean;
  deleting?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const TextArea = ({
  description,
  setDescription,
  loading,
  saving,
  deleting,
  placeholder,
  disabled = false,
}: TextAreaProps) => {
  const { colors, layout } = useTheme();

  return (
    <View>
      <Text
        variant="caption"
        style={styles.label(colors, layout)}
      >
        Descrição (opcional)
      </Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder={placeholder || "Digite uma descrição..."}
        placeholderTextColor={colors.textMuted}
        multiline
        style={[
          styles.input(colors, layout),
          loading ? styles.loading : null,
          disabled ? styles.disabled(colors) : null,
        ]}
        textAlignVertical="top"
      />
    </View>
  );
};

export default TextArea;