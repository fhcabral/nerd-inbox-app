import { Picker } from "@react-native-picker/picker";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  View
} from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import Text from "@/src/components/text";
import TextInputComponent from "@/src/components/textInput";
import useEditSalesModel from "./models/edit-sales.model";
import { SaleItemCard } from "./sale-item-card";
import { SaleDetailsItem } from "./types";

export default function SaleDetails() {
  const model = useEditSalesModel();

  const renderContent = () => {
    if (model.loading) {
      return (
        <View style={{ paddingTop: model.layout.space[6], alignItems: "center" }}>
          <ActivityIndicator />
          <Text
            variant="caption"
            style={{ color: model.colors.textMuted, marginTop: model.layout.space[2] }}
          >
            Carregando venda…
          </Text>
        </View>
      );
    }

    if (!model.sale) {
      return (
        <View style={{ paddingTop: model.layout.space[6], alignItems: "center" }}>
          <Text variant="bodyStrong">Venda não encontrada</Text>

          <View style={{ marginTop: model.layout.space[4], width: "100%" }}>
            <Button title="Voltar" variant="ghost" onPress={model.handleBack} />
          </View>
        </View>
      );
    }

    const sale = model.sale;
    const statusColors = model.getStatusColors(sale.status);

    return (
      <>
        <View
          style={{
            position: "relative",
            padding: model.layout.space[4],
            borderRadius: model.layout.radius.lg,
            backgroundColor: model.colors.elevated,
            borderWidth: model.layout.borderWidth.hairline,
            borderColor: model.colors.border,
            marginBottom: model.layout.space[4],
            marginTop: model.layout.space[3],
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              paddingHorizontal: model.layout.space[3],
              paddingVertical: 6,
              backgroundColor: statusColors.background,
              borderTopRightRadius: model.layout.radius.lg,
              borderBottomLeftRadius: model.layout.radius.md,
            }}
          >
            <Text variant="caption" style={{ color: "#fff" }}>
              {model.formatStatus(sale.status)}
            </Text>
          </View>

          <Text variant="bodyStrong">Resumo</Text>

          <View style={{ marginTop: model.layout.space[3], gap: model.layout.space[2] }}>
            <Text variant="caption" style={{ color: model.colors.textMuted }}>
              Cliente: {sale.customerName?.trim() ? sale.customerName : "—"}
            </Text>

            <Text variant="caption" style={{ color: model.colors.textMuted }}>
              CPF: {model.formatCpf(sale.customerCpf)}
            </Text>

            <Text variant="caption" style={{ color: model.colors.textMuted }}>
              Itens: {model.totalItems}
            </Text>

            <Text variant="caption" style={{ color: model.colors.textMuted }}>
              Criada em: {model.formatDateLabel(sale.createdAt)}
            </Text>

            <Text variant="bodyStrong" style={{ color: model.colors.accent }}>
              Total: {model.formatCurrency(sale.total)}
            </Text>

            {sale.notes?.trim() ? (
              <Text variant="caption" style={{ color: model.colors.textMuted }}>
                Observações: {sale.notes}
              </Text>
            ) : null}
          </View>
        </View>

        {model.isLocked ? (
          <View
            style={{
              padding: model.layout.space[4],
              borderRadius: model.layout.radius.lg,
              backgroundColor: model.colors.surface2,
              borderWidth: model.layout.borderWidth.hairline,
              borderColor: model.colors.border,
              marginBottom: model.layout.space[4],
            }}
          >
            <Text variant="bodyStrong">Venda bloqueada</Text>
            <Text
              variant="caption"
              style={{ color: model.colors.textMuted, marginTop: model.layout.space[2] }}
            >
              Vendas canceladas não podem ser editadas.
            </Text>
          </View>
        ) : null}

        <Text variant="bodyStrong" style={{ marginBottom: model.layout.space[2] }}>
          Itens
        </Text>

        {!sale.items.length ? (
          <View style={{ paddingTop: model.layout.space[4], alignItems: "center" }}>
            <Text variant="caption" style={{ color: model.colors.textMuted }}>
              Nenhum item ainda. Adicione produtos pra fechar a venda.
            </Text>
          </View>
        ) : (
          <View style={{ gap: model.layout.space[2] }}>
            {sale.items.map((item: SaleDetailsItem) => {
              const currentQty = model.editedQuantities[item.id] ?? item.quantity;

              return (
                <SaleItemCard
                  key={item.id}
                  item={item}
                  quantity={currentQty}
                  canEdit={model.canEditItems}
                  onOpenEdit={() => model.setSelectedItem(item)}
                />
              );
            })}
          </View>
        )}

        <View style={{ marginTop: model.layout.space[6], gap: model.layout.space[3] }}>
          {!model.canEdit && model.canStartEdit ? (
            <Button title="Editar venda" onPress={() => model.setCanEdit(true)} />
          ) : null}

          {model.canEdit ? (
            <>
              {model.sale?.status === "DRAFT" ? (
                <Button
                  title="Adicionar produto"
                  onPress={() =>
                    model.router.push({
                      pathname: "/sales/add-item",
                      params: { id: model.saleId },
                    })
                  }
                />
              ) : null}

              {model.sale?.status === "DRAFT" ? (
                <Button
                  title={model.confirming ? "Confirmando…" : "Confirmar venda"}
                  onPress={model.confirmSale}
                  disabled={
                    !model.canConfirm ||
                    model.confirming ||
                    model.cancelling ||
                    model.finalizing
                  }
                />
              ) : null}

              {model.sale?.status === "CONFIRMED" ? (
                <Button
                  title={model.finalizing ? "Finalizando…" : "Finalizar venda"}
                  onPress={model.openFinalizeModal}
                  disabled={
                    !model.canFinalize ||
                    model.finalizing ||
                    model.cancelling ||
                    model.confirming
                  }
                />
              ) : null}

              <Button
                title={model.cancelling ? "Cancelando…" : "Cancelar venda"}
                variant="secondary"
                onPress={model.cancelSale}
                disabled={
                  !model.canCancel ||
                  model.confirming ||
                  model.cancelling ||
                  model.finalizing
                }
              />
            </>
          ) : null}

          <Button title="Voltar" variant="ghost" onPress={model.handleBack} />
        </View>

        <Text
          variant="caption"
          style={{ color: model.colors.textMuted, marginTop: model.layout.space[6] }}
        >
          Itens e ações ficam liberados apenas para vendas em rascunho ou confirmadas.
        </Text>
      </>
    );
  };

  return (
    <SafeScreen>
      <ScrollView
        style={{ flex: 1, backgroundColor: model.colors.bg }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: model.layout.screen.padding,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl refreshing={model.refreshing} onRefresh={model.onRefresh} />
        }
      >
        <Header
          title={model.loading ? "Carregando…" : "Venda"}
          footer={`ID: ${model.saleId}`}
        />
        {renderContent()}
      </ScrollView>

      <Modal
        visible={!!model.selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!model.savingItemId && !model.removingItemId) {
            model.setSelectedItem(null);
          }
        }}
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
              {model.selectedItem?.nameSnapshot ?? "Editar item"}
            </Text>

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
                  model.selectedItem && model.decreaseQuantity(model.selectedItem.id)
                }
                disabled={
                  !model.selectedItem ||
                  model.savingItemId === model.selectedItem.id ||
                  model.removingItemId === model.selectedItem.id
                }
              />

              <View style={{ minWidth: 64, alignItems: "center" }}>
                <Text variant="heading">
                  {model.selectedItem
                    ? model.editedQuantities[model.selectedItem.id] ??
                    model.selectedItem.quantity
                    : 1}
                </Text>
              </View>

              <Button
                title="+"
                variant="secondary"
                onPress={() =>
                  model.selectedItem && model.increaseQuantity(model.selectedItem.id)
                }
                disabled={
                  !model.selectedItem ||
                  model.savingItemId === model.selectedItem.id ||
                  model.removingItemId === model.selectedItem.id
                }
              />
            </View>

            <View style={{ width: "100%", gap: model.layout.space[2] }}>
              <Button
                title={
                  model.selectedItem && model.savingItemId === model.selectedItem.id
                    ? "Salvando…"
                    : "Salvar"
                }
                onPress={async () => {
                  if (!model.selectedItem) return;
                  await model.updateItemQuantity(model.selectedItem);
                  model.setSelectedItem(null);
                }}
                disabled={
                  !model.selectedItem ||
                  !model.hasItemQuantityChanged(model.selectedItem) ||
                  model.savingItemId === model.selectedItem.id ||
                  model.removingItemId === model.selectedItem.id
                }
              />

              <Button
                title={
                  model.selectedItem && model.removingItemId === model.selectedItem.id
                    ? "Removendo…"
                    : "Remover"
                }
                variant="secondary"
                onPress={async () => {
                  if (!model.selectedItem) return;
                  await model.removeItem(model.selectedItem);
                  model.setSelectedItem(null);
                }}
                disabled={
                  !model.selectedItem ||
                  model.savingItemId === model.selectedItem.id ||
                  model.removingItemId === model.selectedItem.id
                }
              />

              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => model.setSelectedItem(null)}
                disabled={
                  !!model.selectedItem &&
                  (model.savingItemId === model.selectedItem.id ||
                    model.removingItemId === model.selectedItem.id)
                }
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={model.showFinalizeModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!model.finalizing) {
            model.setShowFinalizeModal(false);
          }
        }}
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
            }}
          >
            <View style={{ gap: model.layout.space[1] }}>
              <Text variant="bodyStrong">Finalizar venda</Text>
              <Text variant="caption" style={{ color: model.colors.textMuted }}>
                Selecione a forma de pagamento e informe o valor.
              </Text>
            </View>

            <View style={{ gap: model.layout.space[2] }}>
              <Text variant="caption" style={{ color: model.colors.textMuted }}>
                Forma de pagamento
              </Text>

              <View
                style={{
                  borderWidth: model.layout.borderWidth.hairline,
                  borderColor: model.colors.border,
                  borderRadius: model.layout.radius.md,
                  backgroundColor: model.colors.surface,
                  overflow: "hidden",
                }}
              >
                <Picker
                  selectedValue={model.paymentMethod}
                  onValueChange={(value) => model.setPaymentMethod(value)}
                  enabled={!model.finalizing}
                  style={{
                    color: model.colors.text,
                    backgroundColor: model.colors.surface,
                  }}
                  dropdownIconColor={model.colors.text}
                >
                  {Object.values(model.PaymentMethod).map((method) => (
                    <Picker.Item
                      key={method}
                      label={model.formatPaymentMethod(method)}
                      value={method}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ gap: model.layout.space[2] }}>

              <TextInputComponent
                label="Valor"
                value={model.paymentAmount}
                variant="default"
                onChangeText={model.setPaymentAmount}
                keyboardType="numeric"
                placeholder="0,00"
                style={{ marginBottom: model.layout.space[4] }}
              />

              <Button
                title={model.finalizing ? "Finalizando…" : "Confirmar pagamento"}
                onPress={model.finalizeSale}
                disabled={model.finalizing}
              />

              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => model.setShowFinalizeModal(false)}
                disabled={model.finalizing}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}