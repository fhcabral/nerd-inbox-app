import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";

type SaleRow = {
  id: string;
  createdAt: string;
  customerName?: string | null;
  totalItems: number;
  totalValue?: string | null; // deixa string (BRL) por enquanto
};

const mock: SaleRow[] = [
  { id: "1", createdAt: "Hoje", customerName: "Isa", totalItems: 3, totalValue: "R$ 129,90" },
  { id: "2", createdAt: "Ontem", customerName: "Cliente balcão", totalItems: 1, totalValue: "R$ 19,90" },
];

export default function Sales() {
  const { colors, layout } = useTheme();
  const router = useRouter();

  const loading = false;
  const refreshing = false;

  const renderItem = ({ item }: { item: SaleRow }) => {
    return (
      <View
        style={{
          padding: layout.space[4],
          borderRadius: layout.radius.lg,
          backgroundColor: colors.elevated,
          borderWidth: layout.borderWidth.hairline,
          borderColor: colors.border,
          marginBottom: layout.space[3],
        }}
      >
        <Text variant="bodyStrong">{item.customerName?.trim() ? item.customerName : "Venda"}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: layout.space[2] }}>
          <Text variant="caption" style={{ color: colors.textMuted }}>
            {item.createdAt} • {item.totalItems} item(ns)
          </Text>
          <Text variant="caption" style={{ color: colors.accent }}>
            {item.totalValue ?? "—"}
          </Text>
        </View>

        <View style={{ marginTop: layout.space[3] }}>
          <Button
            title="Ver detalhes"
            variant="secondary"
            onPress={() => router.push({ pathname: "/sales/[id]", params: { id: item.id } })}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeScreen style={{ paddingTop: layout.space[5] }}>
      <Screen>
        <Header title="Vendas" footer="Registre e acompanhe suas vendas" />

        <View style={{ marginBottom: layout.space[4] }}>
          <Button title="Nova venda" onPress={() => router.push("/sales/new")} />
        </View>

        {loading ? (
          <View style={{ paddingTop: layout.space[6], alignItems: "center" }}>
            <ActivityIndicator />
            <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[2] }}>
              Carregando vendas…
            </Text>
          </View>
        ) : (
          <FlatList
            data={mock}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <View style={{ paddingTop: layout.space[6], alignItems: "center" }}>
                <Text variant="bodyStrong">Nenhuma venda ainda</Text>
                <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[2] }}>
                  Crie sua primeira venda e adicione itens.
                </Text>
              </View>
            }
          />
        )}
      </Screen>
    </SafeScreen>
  );
}