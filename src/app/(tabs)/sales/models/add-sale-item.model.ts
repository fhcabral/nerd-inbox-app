import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse, PaginatedResponse } from "@/src/api/types";
import { showToast } from "@/src/components/toasts";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { isPaginated } from "@/src/helpers/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductEntity } from "../../products/types";


const formatCurrency = (value?: string | number | null) => {
  if (value == null) return "—";

  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "—";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
};

const useAddSaleItemModel = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const saleId = useMemo(() => (typeof id === "string" ? id : ""), [id]);
  const { colors, layout } = useTheme();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [items, setItems] = useState<ProductEntity[]>([]);
  const [meta, setMeta] =
    useState<PaginatedResponse<ProductEntity>["meta"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selected, setSelected] = useState<ProductEntity | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [saving, setSaving] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);

  const requestSeq = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const canLoadMore = useMemo(() => {
    if (!meta) return false;
    return meta.page < meta.pageCount;
  }, [meta]);

  useEffect(() => {
    fetchProducts({ reset: true, nextPage: 1 });
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

  async function fetchProducts(opts?: { reset?: boolean; nextPage?: number }) {
    const reset = opts?.reset ?? false;
    const nextPage = opts?.nextPage ?? 1;

    const seq = ++requestSeq.current;

    try {
      if (reset) setLoading(true);

      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(limit));
      params.set("sort", "createdAt");
      params.set("order", "DESC");

      if (debounced) {
        params.set("search", debounced);
      }

      const data = handleResponse(
        await api.get(`/products?${params.toString()}`)
      ) as DefaultResponse<ProductEntity>;

      if (seq !== requestSeq.current) return;

      if (!isPaginated<ProductEntity>(data.data)) {
        throw new Error("Unexpected response format");
      }

      const pageData = data.data.data;
      const pageMeta = data.data.meta;

      setMeta(pageMeta);

      setItems((prev) => {
        if (reset) return pageData;

        const map = new Map<string, ProductEntity>();
        for (const p of prev) map.set(p.id, p);
        for (const p of pageData) map.set(p.id, p);

        return Array.from(map.values());
      });

      setPage(nextPage);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  const openQuantityModal = (product: ProductEntity) => {
    setSelected(product);
    setQuantity("1");
    setQuantityModalVisible(true);
  };

  const closeQuantityModal = () => {
    if (saving) return;
    setQuantityModalVisible(false);
  };

  const canAdd =
    !!selected &&
    Number.isFinite(Number(quantity)) &&
    Number(quantity) >= 1 &&
    !saving;

  async function onAdd() {
    try {
      if (!selected) {
        showToast('error', 'Selecione um produto');
        return;
      }

      const q = Number(quantity);

      if (!Number.isFinite(q) || q < 1) {
        showToast('error', 'Quantidade inválida');
        return;
      }

      setSaving(true);

      await api.post(`/sales/${saleId}/items`, {
        productId: selected.id,
        quantity: q,
      });

      setQuantityModalVisible(false);
      showToast('success', `Item adicionado na venda.`);
      router.back();
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  const handleBack = () => {
    router.back();
  };

  return {
    colors,
    layout,
    router,

    saleId,

    search,
    setSearch,

    items,
    loading,
    refreshing,
    loadingMore,
    onRefresh,
    onEndReached,

    selected,
    quantity,
    setQuantity,
    saving,
    canAdd,

    quantityModalVisible,
    openQuantityModal,
    closeQuantityModal,
    onAdd,

    handleBack,
    formatCurrency,
  };
};

export default useAddSaleItemModel;