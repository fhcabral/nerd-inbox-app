import { ProductEntity } from "@/src/app/(tabs)/products/types";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { formatBRL } from "@/src/helpers/helper";
import { useRouter } from "expo-router";
import { Image, Pressable, View } from "react-native";
import Text from "../text";

const ProductItem = ({ item }: { item: ProductEntity }) => {
  const { colors, layout } = useTheme();
  const router = useRouter();

  const price = item.price ? formatBRL(Number(item.price)) : "—";
  const stock = typeof item.stock === "number" ? item.stock : null;

  const stockLabel =
    stock === null
      ? ""
      : stock <= 0
        ? "Sem estoque"
        : stock <= 5
          ? `Estoque baixo (${stock})`
          : `Estoque (${stock})`;

  const stockColor =
    stock === null
      ? colors.textMuted
      : stock <= 0
        ? colors.error
        : stock <= 5
          ? colors.warning
          : colors.text;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/products/[id]",
          params: { id: item.id },
        })
      }
      style={({ pressed }) => [
        {
          flexDirection: "row",
          borderRadius: layout.radius.lg,
          backgroundColor: colors.elevated,
          borderWidth: layout.borderWidth.hairline,
          borderColor: colors.border,
          marginBottom: layout.space[3],
          overflow: "hidden",
          minHeight: 92,
        },
        pressed && { transform: [{ scale: 0.99 }], opacity: 0.95 },
      ]}
    >
      <View
        style={{
          width: 92,
          height: 92,
          backgroundColor: colors.surface2,
        }}
      >
        {item.images?.length ? (
          <Image
            source={{ uri: item.images[0].url }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text variant="caption" style={{ color: colors.textMuted }}>
              IMG
            </Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1, padding: layout.space[4] }}>
        <Text variant="bodyStrong">{item.name}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: layout.space[2],
          }}
        >
          <Text variant="caption" style={{ color: colors.accent }}>
            {price}
          </Text>

          {!!stockLabel && (
            <Text variant="caption" style={{ color: stockColor }}>
              {stockLabel}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export { ProductItem };

