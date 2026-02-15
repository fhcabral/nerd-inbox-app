import Button from "@/src/components/button";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import { useAuth } from "@/src/contexts/auth/authProvider";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { Switch, View } from "react-native";

export default function Settings() {
  const { colors, layout, mode, setMode } = useTheme();
  const { logout } = useAuth();

  const isDark = mode === "dark";

  return (
    <SafeScreen>
      <Screen>
      {/* Header */}
      <View style={{ marginBottom: layout.space[6] }}>
        <Text variant="heading">Configurações</Text>
        <Text
          variant="caption"
          style={{ color: colors.textMuted, marginTop: layout.space[1] }}
        >
          Preferências do aplicativo
        </Text>
      </View>

      {/* APARÊNCIA */}
      <View style={{ marginBottom: layout.space[6] }}>
        <Text
          variant="bodyStrong"
          style={{ marginBottom: layout.space[3] }}
        >
          Aparência
        </Text>

        <View
          style={{
            backgroundColor: colors.elevated,
            borderRadius: layout.radius.lg,
            borderWidth: layout.borderWidth.hairline,
            borderColor: colors.border,
            padding: layout.space[4],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Modo escuro</Text>
          <Switch
            value={isDark}
            onValueChange={(value) => setMode(value ? "dark" : "light")}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.bg}
          />
        </View>
      </View>

      {/* CONTA */}
      <View>
        <Text
          variant="bodyStrong"
          style={{ marginBottom: layout.space[3] }}
        >
          Conta
        </Text>

        <View
          style={{
            backgroundColor: colors.elevated,
            borderRadius: layout.radius.lg,
            borderWidth: layout.borderWidth.hairline,
            borderColor: colors.border,
            padding: layout.space[4],
          }}
        >
          <Button
            title="Sair da conta"
            variant="secondary"
            onPress={logout}
          />
        </View>
      </View>

      {/* FOOTER */}
      <Text
        variant="caption"
        style={{
          marginTop: layout.space[7],
          color: colors.textMuted,
          textAlign: "center",
        }}
      >
        Nerd Inbox • v1.0
      </Text>
           </Screen>
    </SafeScreen>
  );
}
