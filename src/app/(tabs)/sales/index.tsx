import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { ScreenList } from "@/src/components/screenList";
import SearchBar from "@/src/components/searchBar";
import Text from "@/src/components/text";
import { SaleRow, useSalesModel } from "./models/sales.model";

export default function Sales() {
  const model = useSalesModel();

  const renderItem = ({ item }: { item: SaleRow }) => {
    const statusColors = model.getStatusColors(item.status);

    return (
      <View
        style={{
          position: "relative",
          padding: model.layout.space[4],
          borderRadius: model.layout.radius.lg,
          backgroundColor: model.colors.elevated,
          borderWidth: model.layout.borderWidth.hairline,
          borderColor: model.colors.border,
          marginBottom: model.layout.space[3],
          paddingTop: model.layout.space[6]
        }}
      >
        {/* BADGE */}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,

            paddingHorizontal: model.layout.space[3],
            paddingVertical: 6,

            backgroundColor: statusColors.text,

            borderTopRightRadius: model.layout.radius.lg,
            borderBottomLeftRadius: model.layout.radius.md,

            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            variant="caption"
            style={{
              color: "#fff",
            }}
          >
            {model.formatStatus(item.status)}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,

            paddingHorizontal: model.layout.space[3],
            paddingVertical: 6,

            backgroundColor: statusColors.text,

            borderTopRightRadius: model.layout.radius.lg,
            borderBottomLeftRadius: model.layout.radius.md,

            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            variant="caption"
            style={{
              color: "#fff",
            }}
          >
            {model.formatStatus(item.status)}
          </Text>
        </View>

        <Text variant="bodyStrong">
          {item.customerName?.trim() ? item.customerName : "Venda"}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: model.layout.space[2],
          }}
        >
          <Text variant="caption" style={{ color: model.colors.textMuted }}>
            {item.createdAt}
          </Text>

          <Text variant="caption" style={{ color: model.colors.accent }}>
            {item.totalValue ?? "—"}
          </Text>
        </View>

        <View style={{ marginTop: model.layout.space[3] }}>
          <Button
            title="Ver detalhes"
            variant="secondary"
            onPress={() =>
              model.router.push({
                pathname: "/sales/[id]",
                params: { id: item.id },
              })
            }
          />
        </View>
      </View>
    );
  };

  return (
    <SafeScreen>
      <ScreenList>
        <Header title="Vendas" footer="Registre e acompanhe suas vendas" />

          <SearchBar
            placeholder="Buscar venda..."
            value={model.search}
            onChangeText={model.setSearch}
          />

          <Button style={{ marginBottom: model.layout.space[4] }} title="Nova venda" onPress={() => model.router.push("/sales/new")} />

        {model.loading ? (
          <View style={{ paddingTop: model.layout.space[6], alignItems: "center" }}>
            <ActivityIndicator />
            <Text
              variant="caption"
              style={{ color: model.colors.textMuted, marginTop: model.layout.space[2] }}
            >
              Carregando vendas…
            </Text>
          </View>
        ) : (
          <FlatList
            data={model.items}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            onEndReached={model.onEndReached}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl refreshing={model.refreshing} onRefresh={model.onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 120 }}
            ListFooterComponent={
              model.loadingMore ? (
                <View style={{ paddingVertical: model.layout.space[4], alignItems: "center" }}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={{ paddingTop: model.layout.space[6], alignItems: "center" }}>
                <Text variant="bodyStrong">Nenhuma venda ainda</Text>
                <Text
                  variant="caption"
                  style={{ color: model.colors.textMuted, marginTop: model.layout.space[2] }}
                >
                  Crie sua primeira venda e adicione itens.
                </Text>
              </View>
            }
          />
        )}
      </ScreenList>
    </SafeScreen>
  );
}