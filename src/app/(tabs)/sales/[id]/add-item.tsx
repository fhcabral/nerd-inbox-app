import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import TextInputComponent from "@/src/components/textInput";
import { useTheme } from "@/src/contexts/theme/useTheme";

type ProductLite = { id: string; name: string; price?: string };

const mockProducts: ProductLite[] = [
  { id: "p1", name: "Naruto", price: "R$ 12,50" },
  { id: "p2", name: "Sakura", price: "R$ 50,56" },
  { id: "p3", name: "Pizza de aço", price: "R$ 485,33" },
];

export default function AddSaleItem() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const saleId = useMemo(() => (typeof id === "string" ? id : ""), [id]);
  const { colors, layout } = useTheme();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductLite | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [saving, setSaving] = useState(false);

  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const canAdd = !!selected && Number(quantity) >= 1 && !saving;

  async function onAdd() {
    try {
      setSaving(true);

      const q = Number(quantity);
      if (!Number.isFinite(q) || q < 1) {
        Alert.alert("Quantidade inválida", "Use um número >= 1.");
        return;
      }

      // TODO: POST /sales/:id/items com AddSaleItemDto
      // await api.post(`/sales/${saleId}/items`, { productId: selected!.id, quantity: q })

      Alert.alert("Adicionado", "Item adicionado na venda.");
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível adicionar o item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeScreen style={{ paddingTop: layout.space[5] }}>
      <Screen>
        <Header title="Adicionar produto" footer={`Venda: ${saleId}`} />

        <TextInputComponent
          label="Buscar produto"
          value={search}
          onChangeText={setSearch}
          placeholder="Digite o nome…"
        />

        <View style={{ marginTop: layout.space[3] }}>
          <Text variant="caption" style={{ color: colors.textMuted, marginBottom: layout.space[2] }}>
            Selecione um produto
          </Text>

          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingBottom: 12 }}
            renderItem={({ item }) => {
              const active = selected?.id === item.id;
              return (
                <View
                  style={{
                    padding: layout.space[4],
                    borderRadius: layout.radius.lg,
                    backgroundColor: active ? colors.surface2 : colors.elevated,
                    borderWidth: layout.borderWidth.hairline,
                    borderColor: active ? colors.primary : colors.border,
                    marginBottom: layout.space[2],
                  }}
                >
                  <Text variant="bodyStrong">{item.name}</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: layout.space[2] }}>
                    <Text variant="caption" style={{ color: colors.textMuted }}>
                      {item.price ?? "—"}
                    </Text>
                    <Button title={active ? "Selecionado" : "Selecionar"} variant="secondary" onPress={() => setSelected(item)} />
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={{ marginTop: layout.space[3], gap: layout.space[2] }}>
          <TextInputComponent
            label="Quantidade"
            value={quantity}
            onChangeText={(v) => setQuantity(v.replace(/\D/g, ""))}
            placeholder="1"
          />

          <View style={{ gap: layout.space[3] }}>
            <Button title={saving ? "Adicionando…" : "Adicionar à venda"} onPress={onAdd} disabled={!canAdd} />
            <Button title="Voltar" variant="ghost" onPress={() => router.back()} disabled={saving} />
          </View>
        </View>

        <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[6] }}>
          Próximo: editar quantidade e remover item via UpdateSaleItemDto.
        </Text>
      </Screen>
    </SafeScreen>
  );
}