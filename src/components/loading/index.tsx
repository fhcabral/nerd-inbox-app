import { useTheme } from "@/src/contexts/theme/useTheme";
import { ActivityIndicator, View } from "react-native";
import Text from "../text";

const Loading = ({text}: {text?: string}) => {
    const { colors, layout } = useTheme();
    return (
        <View style={{ paddingTop: layout.space[6], alignItems: "center" }}>
            <ActivityIndicator color={colors.accent} />
            <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[2] }}>
                {text || "Carregando..."}
            </Text>
        </View>
    )
}

export default Loading;