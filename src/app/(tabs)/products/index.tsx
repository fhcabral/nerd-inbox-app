import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  View
} from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import SearchBar from "@/src/components/searchBar";
import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";

// Ajusta conforme teu model real
type ProductEntity = {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  // se você tiver isso no entity, show
  primaryImageUrl?: string | null;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};

// teu responseJson pode ser { data, message, ok } etc.
type ApiResponse<T> = {
  data: T;
  message?: string;
  ok?: boolean;
};

const BASE_URL = "http://SEU_HOST/api/v1"; // 👈 troca aqui (ideal: env)

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function Products() {
  const { colors, layout } = useTheme();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [page, setPage] = useState(1);
  const limit = 20;

  const [items, setItems] = useState<ProductEntity[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<ProductEntity>["meta"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // debounce simples
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const canLoadMore = useMemo(() => {
    if (!meta) return false;
    return meta.page < meta.pageCount;
  }, [meta]);

  async function fetchProducts(opts?: { reset?: boolean; nextPage?: number }) {
    const reset = opts?.reset ?? false;
    const nextPage = opts?.nextPage ?? 1;

    try {
      if (reset) setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(limit));
      params.set("sort", "createdAt");
      params.set("order", "DESC");
      if (debounced) params.set("search", debounced);

      const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
      const json: ApiResponse<ProductEntity[] | PaginatedResponse<ProductEntity>> = await res.json();

      const payload = json.data ?? (json as any);

      // suporta tanto retorno paginado quanto array puro
      const pageData = Array.isArray(payload) ? payload : payload.data;
      const pageMeta = Array.isArray(payload)
        ? null
        : payload.meta;

      setMeta(pageMeta);

      setItems((prev) => (reset ? pageData : [...prev, ...pageData]));
      setPage(nextPage);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  // initial + quando muda search
  useEffect(() => {
    fetchProducts({ reset: true, nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts({ reset: true, nextPage: 1 });
  };

  const onEndReached = () => {
    if (loading || refreshing || loadingMore) return;
    if (!canLoadMore) return;

    setLoadingMore(true);
    fetchProducts({ reset: false, nextPage: page + 1 });
  };

  const renderItem = ({ item }: { item: ProductEntity }) => {
    const price = typeof item.price === "number" ? formatBRL(item.price) : "—";
    const stock = typeof item.stock === "number" ? item.stock : null;
    const stockLabel =
      stock === null ? "" : stock <= 0 ? "Sem estoque" : stock <= 5 ? `Estoque baixo (${stock})` : `Estoque (${stock})`;

    const stockColor =
      stock === null ? colors.textMuted : stock <= 0 ? colors.error : stock <= 5 ? colors.warning : colors.success;

    return (
      <Pressable
        onPress={() => router.replace({
          pathname: "/products/[id]",
          params: { id: item.id },
        })
        }
        style={({ pressed }) => [
          {
            flexDirection: "row",
            gap: layout.space[3],
            padding: layout.space[4],
            borderRadius: layout.radius.lg,
            backgroundColor: colors.elevated,
            borderWidth: layout.borderWidth.hairline,
            borderColor: colors.border,
            marginBottom: layout.space[3],
          },
          pressed && { transform: [{ scale: 0.99 }], opacity: 0.95 },
        ]}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: colors.surface2,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.primaryImageUrl ? (
            <Image source={{ uri: item.primaryImageUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <Text variant="caption" style={{ color: colors.textMuted }}>
              IMG
            </Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">{item.name}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: layout.space[2] }}>
            <Text variant="caption" style={{ color: colors.textMuted }}>
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

  return (
    <SafeScreen>
      <Screen >
      <Header title={'Produtos'} footer={'Gerencie o seu catálogo'}/>
      <SearchBar value={search} placeholder="Buscar produto..." onChangeText={setSearch}/>
      

      {/* CTA */}
      <View style={{ marginBottom: layout.space[4] }}>
        <Button title="Novo produto" onPress={() => router.push("/products/new")} />
      </View>

      {/* List */}
      {loading ? (
        <View style={{ paddingTop: layout.space[6], alignItems: "center" }}>
          <ActivityIndicator />
          <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[2] }}>
            Carregando produtos…
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReachedThreshold={0.6}
          onEndReached={onEndReached}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={{ paddingTop: layout.space[6], alignItems: "center" }}>
              <Text variant="bodyStrong">Nada aqui ainda</Text>
              <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[2] }}>
                Crie seu primeiro produto 👀
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: layout.space[4] }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
    </SafeScreen>
  );
}
