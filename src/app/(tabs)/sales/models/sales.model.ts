import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse, PaginatedResponse } from "@/src/api/types";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { isPaginated } from "@/src/helpers/helper";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SaleStatus } from "./new-sales.model";

type SaleEntity = {
  id: string;
  status: "PAID" | "PENDING" | "CANCELED" | string;
  total: string;
  notes?: string | null;
  customerName?: string | null;
  customerCpf?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SaleRow = {
  id: string;
  createdAt: string;
  customerName?: string | null;
  totalItems: number;
  totalValue?: string | null;
  status: string;
};

const formatCurrency = (value?: string | number | null) => {
  if (value == null) return null;

  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return null;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
};

const formatDateLabel = (date: string) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return date;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
};

const mapSaleToRow = (sale: SaleEntity): SaleRow => ({
  id: sale.id,
  customerName: sale.customerName ?? null,
  createdAt: formatDateLabel(sale.createdAt),
  totalItems: 0,
  totalValue: formatCurrency(sale.total),
  status: sale.status,
});

const useSalesModel = () => {
  const { colors, layout } = useTheme();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [items, setItems] = useState<SaleRow[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<SaleRow>["meta"] | null>(null);

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
    fetchSales({ reset: true, nextPage: 1 });
  }, [debounced]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSales({ reset: true, nextPage: 1 });
  };

  const onEndReached = () => {
    if (loading || refreshing || loadingMore) return;
    if (!canLoadMore) return;

    setLoadingMore(true);
    fetchSales({ reset: false, nextPage: page + 1 });
  };

  async function fetchSales(opts?: { reset?: boolean; nextPage?: number }) {
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

      if (debounced) params.set("search", debounced);

      const data = handleResponse(
        await api.get(`/sales?${params.toString()}`)
      ) as DefaultResponse<SaleEntity>;

      if (seq !== requestSeq.current) return;

      if (!isPaginated<SaleEntity>(data.data)) {
        throw new Error("Unexpected response format");
      }

      const pageData = data.data.data.map(mapSaleToRow);
      const pageMeta = data.data.meta;

      setMeta(pageMeta);

      setItems((prev) => {
        if (reset) return pageData;

        const map = new Map<string, SaleRow>();
        for (const item of prev) map.set(item.id, item);
        for (const item of pageData) map.set(item.id, item);

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

  const formatStatus = (status: SaleStatus) => {
  switch (status) {
    case "DRAFT":
      return "Rascunho";
    case "CONFIRMED":
      return "Confirmada";
    case "PAID":
      return "Paga";
    case "CANCELED":
      return "Cancelada";
    default:
      return status;
  }
};

const getStatusColors = useCallback(
    (status: SaleStatus) => {
      switch (status) {
        case "PAID":
          return { text: colors.success, background: colors.success, border: colors.success };
        case "CONFIRMED":
          return {
            text: colors.info ?? colors.primary,
            background: colors.info ?? colors.primary,
            border: colors.info ?? colors.primary,
          };
        case "DRAFT":
          return { text: colors.warning, background: colors.warning, border: colors.warning };
        case "CANCELED":
          return { text: colors.fun, background: colors.fun, border: colors.fun };
        default:
          return {
            text: colors.textMuted,
            background: colors.textMuted,
            border: colors.textMuted,
          };
      }
    },
    [colors]
  );

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
    formatStatus,
  getStatusColors,
  };
};

export { useSalesModel };

