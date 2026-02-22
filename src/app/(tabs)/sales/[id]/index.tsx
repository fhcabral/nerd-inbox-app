import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";

type SaleItem = {
  id: string;
  name: string;
  quantity: number;
  priceSnapshot?: string;
};

const mockItems: SaleItem[] = [
  { id: "i1", name: "Naruto", quantity: 2, priceSnapshot: "R$ 12,50" },
  { id: "i2", name: "Sakura", quantity: 1, priceSnapshot: "R$ 50,56" },
];

export default function SaleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const saleId = useMemo(() => (typeof id === "string" ? id : ""), [id]);
  const { colors, layout } = useTheme();

  return (
    <SafeScreen style={{ paddingTop: layout.space[5] }}>
      <Screen>
        <Header title="Venda" footer={`ID: ${saleId}`} />

        {/* Resumo */}
        <View
          style={{
            padding: layout.space[4],
            borderRadius: layout.radius.lg,
            backgroundColor: colors.elevated,
            borderWidth: layout.borderWidth.hairline,
            borderColor: colors.border,
            marginBottom: layout.space[4],
          }}
        >
          <Text variant="bodyStrong">Resumo</Text>

          <View style={{ marginTop: layout.space[2], gap: layout.space[1] }}>
            <Text variant="caption" style={{ color: colors.textMuted }}>
              Cliente: —
            </Text>
            <Text variant="caption" style={{ color: colors.textMuted }}>
              Itens: {mockItems.reduce((a, i) => a + i.quantity, 0)}
            </Text>
            <Text variant="caption" style={{ color: colors.textMuted }}>
              Total: —
            </Text>
          </View>

          <View style={{ marginTop: layout.space[3] }}>
            <Button
              title="Adicionar produto"
              onPress={() => router.push({ pathname: "/sales/[id]/add-item", params: { id: saleId } })}
            />
          </View>
        </View>

        {/* Itens */}
        <Text variant="bodyStrong" style={{ marginBottom: layout.space[2] }}>
          Itens
        </Text>

        {mockItems.length === 0 ? (
          <View style={{ paddingTop: layout.space[4], alignItems: "center" }}>
            <Text variant="caption" style={{ color: colors.textMuted }}>
              Nenhum item ainda. Adicione produtos pra fechar a venda.
            </Text>
          </View>
        ) : (
          <View style={{ gap: layout.space[2] }}>
            {mockItems.map((it) => (
              <View
                key={it.id}
                style={{
                  padding: layout.space[4],
                  borderRadius: layout.radius.lg,
                  backgroundColor: colors.surface2,
                  borderWidth: layout.borderWidth.hairline,
                  borderColor: colors.border,
                }}
              >
                <Text variant="bodyStrong">{it.name}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: layout.space[2] }}>
                  <Text variant="caption" style={{ color: colors.textMuted }}>
                    Qtd: {it.quantity}
                  </Text>
                  <Text variant="caption" style={{ color: colors.accent }}>
                    {it.priceSnapshot ?? "—"}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: layout.space[2], marginTop: layout.space[3] }}>
                  <View style={{ flex: 1 }}>
                    <Button title="Editar qtd" variant="secondary" onPress={() => {}} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button title="Remover" variant="secondary" onPress={() => {}} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: layout.space[6], gap: layout.space[3] }}>
          <Button title="Finalizar venda" onPress={() => {}} />
          <Button title="Voltar" variant="ghost" onPress={() => router.back()} />
        </View>

        <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[6] }}>
          Próximo: finalizar (confirmar pagamento) + histórico.
        </Text>
      </Screen>
    </SafeScreen>
  );
}