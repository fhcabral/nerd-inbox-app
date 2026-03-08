import {
  FlatList,
  Modal,
  RefreshControl,
  View
} from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import Loading from "@/src/components/loading";
import { ProductItem } from "@/src/components/productsItens";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { ScreenList } from "@/src/components/screenList";
import SearchBar from "@/src/components/searchBar";
import Text from "@/src/components/text";
import useAddSaleItemModel from "./models/add-sale-item.model";

export default function AddSaleItem() {
  const model = useAddSaleItemModel();

  return (
    <SafeScreen>
      <ScreenList>
        <Header title="Adicionar produto" footer={`Venda: ${model.saleId}`} />

        <SearchBar
          value={model.search}
          placeholder="Buscar produto..."
          onChangeText={model.setSearch}
        />

        <Button
          style={{ marginBottom: model.layout.space[4] }}
          title="Voltar"
          variant="ghost"
          onPress={model.handleBack}
        />

        {model.loading ? (
          <Loading text="Carregando produtos..." />
        ) : (
          <FlatList
            data={model.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductItem item={item} onPress={() => model.openQuantityModal(item)} />}
            onEndReachedThreshold={0.6}
            onEndReached={model.onEndReached}
            refreshControl={
              <RefreshControl
                refreshing={model.refreshing}
                onRefresh={model.onRefresh}
              />
            }
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <View style={{ paddingTop: model.layout.space[6], alignItems: "center" }}>
                <Text variant="bodyStrong">Nada aqui ainda</Text>
                <Text
                  variant="caption"
                  style={{
                    color: model.colors.textMuted,
                    marginTop: model.layout.space[2],
                  }}
                >
                  Nenhum produto encontrado 👀
                </Text>
              </View>
            }
            ListFooterComponent={
              model.loadingMore ? (
                <Loading text="Carregando mais produtos..." />
              ) : null
            }
          />
        )}

        {/* MODAL DE QUANTIDADE */}

        <Modal
          visible={model.quantityModalVisible}
          transparent
          animationType="fade"
          onRequestClose={model.closeQuantityModal}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.45)",
              justifyContent: "center",
              padding: model.layout.space[4],
            }}
          >
            <View
              style={{
                backgroundColor: model.colors.bg,
                borderRadius: model.layout.radius.lg,
                padding: model.layout.space[5],
                borderWidth: model.layout.borderWidth.hairline,
                borderColor: model.colors.border,
                gap: model.layout.space[4],
                alignItems: "center",
              }}
            >
              <Text variant="bodyStrong">
                Adicionar {model.selected?.name}
              </Text>

              {/* QUANTITY STEPPER */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: model.layout.space[3],
                }}
              >
                <Button
                  title="-"
                  variant="secondary"
                  onPress={() =>
                    model.setQuantity(
                      String(Math.max(1, Number(model.quantity) - 1))
                    )
                  }
                />

                <View
                  style={{
                    minWidth: 64,
                    alignItems: "center",
                  }}
                >
                  <Text variant="heading">
                    {model.quantity}
                  </Text>
                </View>

                <Button
                  title="+"
                  variant="secondary"
                  onPress={() =>
                    model.setQuantity(String(Number(model.quantity) + 1))
                  }
                />
              </View>

              {/* ACTIONS */}

              <View style={{ width: "100%", gap: model.layout.space[2] }}>
                <Button
                  title={model.saving ? "Adicionando…" : "Confirmar"}
                  onPress={model.onAdd}
                  disabled={!model.canAdd}
                />

                <Button
                  title="Cancelar"
                  variant="ghost"
                  onPress={model.closeQuantityModal}
                  disabled={model.saving}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScreenList>
    </SafeScreen>
  );
}