import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse, PaginatedResponse } from "@/src/api/types";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductEntity } from "../types";

const useProductsModel = () => {
  const { colors, layout } = useTheme();
  const router = useRouter();

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
      params.set("order", "ASC");
      if (debounced) params.set("search", debounced);

      const data = handleResponse(
        await api.get(`/products?${params.toString()}`)
      ) as DefaultResponse<ProductEntity>;

      if (seq !== requestSeq.current) return;

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
      handleError(e)
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  return {
    colors,
    layout,
    router,

    items,
    meta,

    search,
    setSearch,

    loading,
    refreshing,
    loadingMore,

    canLoadMore,
    onRefresh,
    onEndReached,
  };
};

export default useProductsModel;