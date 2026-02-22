import { useTheme } from "@/src/contexts/theme/useTheme";
import { TextInput, View } from "react-native";
import Text from "../text";

type TextAreaProps = {
    description: string;
    setDescription: (text: string) => void;
    loading?: boolean;
    saving?: boolean;
    deleting?: boolean;
    placeholder?: string;
};

const TextArea = ({ description, setDescription, loading, saving, deleting, placeholder }: TextAreaProps) => {
    const { colors, layout } = useTheme();
    return (
        <View>
            <Text variant="caption" style={{ color: colors.primary, marginBottom: layout.space[1] }}>
                Descrição (opcional)
            </Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={placeholder || "Digite uma descrição..."}
                placeholderTextColor={colors.textMuted}
                multiline
                editable={!loading && !saving && !deleting}
                style={{
                    minHeight: 96,
                    borderRadius: layout.radius.md,
                    paddingHorizontal: layout.space[4],
                    paddingVertical: layout.space[3],
                    borderWidth: layout.borderWidth.hairline,
                    borderColor: colors.primary,
                    backgroundColor: colors.surface2,
                    color: colors.text,
                    fontSize: 16,
                    textAlignVertical: "top",
                    opacity: loading ? 0.6 : 1,
                }}
            />
        </View>
    );
}

export default TextArea;