import { Image, Pressable, View } from "react-native";

import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { formatBRL } from "@/src/helpers/helper";
import { SaleDetailsItem } from "./types";

type Props = {
  item: SaleDetailsItem;
  quantity: number;
  canEdit: boolean;
  onOpenEdit: () => void;
};

function SaleItemCard({
  item,
  quantity,
  canEdit,
  onOpenEdit,
}: Props) {
  const { colors, layout } = useTheme();

  const unitPrice = item.unitPriceSnapshot
    ? formatBRL(Number(item.unitPriceSnapshot))
    : "—";

  const subtotal = item.lineTotal
    ? formatBRL(Number(item.lineTotal))
    : "—";

  const imageUrl = item.product?.images?.[0]?.url ?? null;

  return (
    <Pressable
      onPress={canEdit ? onOpenEdit : undefined}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          height: 120,
          borderRadius: layout.radius.lg,
          backgroundColor: colors.elevated,
          borderWidth: layout.borderWidth.hairline,
          borderColor: colors.border,
          overflow: "hidden",
        },
        pressed && canEdit
          ? { opacity: 0.96, transform: [{ scale: 0.995 }] }
          : null,
      ]}
    >
      <View
        style={{
          width: 84,
          height: "100%",
          backgroundColor: colors.surface2,
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text variant="caption" style={{ color: colors.textMuted }}>
              IMG
            </Text>
          </View>
        )}
      </View>

      <View
        style={{
          flex: 1,
          paddingVertical: layout.space[3],
          paddingHorizontal: layout.space[3],
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: layout.space[2],
          }}
        >
          <View style={{ flex: 1, paddingRight: layout.space[1] }}>
            <Text variant="bodyStrong">
              {item.nameSnapshot}
            </Text>

            <Text
              variant="caption"
              style={{
                color: colors.textMuted,
                marginTop: 2,
              }}
            >
              SKU: {item.skuSnapshot?.trim() ? item.skuSnapshot : "—"}
            </Text>
          </View>

          {canEdit ? (
            <View
              style={{
                paddingHorizontal: layout.space[2],
                paddingVertical: 5,
                borderRadius: layout.radius.md,
                backgroundColor: colors.surface2,
                borderWidth: layout.borderWidth.hairline,
                borderColor: colors.border,
                alignSelf: "flex-start",
              }}
            >
              <Text variant="caption" style={{ color: colors.textMuted }}>
                Editar
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ gap: 4 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="caption" style={{ color: colors.textMuted }}>
              Qtd: {quantity}
            </Text>

            <Text variant="caption" style={{ color: colors.textMuted }}>
              Valor: {unitPrice}
            </Text>
          </View>

          <Text
            variant="caption"
            style={{
              color: colors.accent,
            }}
          >
            Subtotal: {subtotal}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export { SaleItemCard };

