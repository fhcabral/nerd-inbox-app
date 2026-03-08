import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse } from "@/src/api/types";
import { showToast } from "@/src/components/toasts";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { isPaginated } from "@/src/helpers/helper";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  PaymentMethod,
  SaleDetailsEntity,
  SaleDetailsItem,
  SaleStatus,
} from "../types";

const formatCurrency = (value?: string | number | null) => {
  if (value == null) return "—";
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "—";

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

const formatCpf = (cpf?: string | null) => {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

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

const formatPaymentMethod = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.PIX:
      return "Pix";
    case PaymentMethod.CASH:
      return "Dinheiro";
    case PaymentMethod.CARD:
      return "Cartão";
    case PaymentMethod.TRANSFER:
      return "Transferência";
    default:
      return method;
  }
};

const useEditSalesModel = () => {
  const [selectedItem, setSelectedItem] = useState<SaleDetailsItem | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.PIX
  );
  const [paymentAmount, setPaymentAmount] = useState("");

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const saleId = useMemo(() => (typeof id === "string" ? id : ""), [id]);
  const { colors, layout } = useTheme();

  const [sale, setSale] = useState<SaleDetailsEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [canEdit, setCanEdit] = useState(false);

  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>(
    {}
  );

  const editableStatuses = useMemo(() => ["DRAFT", "CONFIRMED", "PAID"], []);
  const canStartEdit = !!sale && editableStatuses.includes(sale.status);

  const totalItems = useMemo(
    () => sale?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [sale]
  );

  const hasItems = (sale?.items?.length ?? 0) > 0;

  const openFinalizeModal = () => {
    if (!sale) return;

    setPaymentMethod(PaymentMethod.PIX);
    setPaymentAmount(String(Number(sale.total ?? 0)));
    setShowFinalizeModal(true);
  };

  const getStatusColors = useCallback(
    (status: SaleStatus) => {
      switch (status) {
        case "PAID":
          return {
            text: colors.success,
            background: colors.success,
            border: colors.success,
          };
        case "CONFIRMED":
          return {
            text: colors.info ?? colors.primary,
            background: colors.info ?? colors.primary,
            border: colors.info ?? colors.primary,
          };
        case "DRAFT":
          return {
            text: colors.warning,
            background: colors.warning,
            border: colors.warning,
          };
        case "CANCELED":
          return {
            text: colors.fun,
            background: colors.fun,
            border: colors.fun,
          };
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

  const fetchSale = useCallback(
    async (showLoading = false) => {
      if (!saleId) return;

      try {
        if (showLoading) setLoading(true);

        const data = handleResponse(
          await api.get(`/sales/${saleId}`)
        ) as DefaultResponse<SaleDetailsEntity>;

        if (!isPaginated<SaleDetailsEntity>(data.data)) {
          setSale(data.data);

          const qtyMap = (data.data.items ?? []).reduce<Record<string, number>>(
            (acc, item) => {
              acc[item.id] = item.quantity;
              return acc;
            },
            {}
          );

          setEditedQuantities(qtyMap);
        }
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [saleId]
  );

  useEffect(() => {
    fetchSale(true);
  }, [fetchSale]);

  useFocusEffect(
    useCallback(() => {
      fetchSale(false);
    }, [fetchSale])
  );

  useEffect(() => {
    if (!canStartEdit) setCanEdit(false);
  }, [canStartEdit]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSale(false);
  };

  const handleBack = () => router.back();

  const increaseQuantity = (itemId: string) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] ?? 1) + 1,
    }));
  };

  const decreaseQuantity = (itemId: string) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] ?? 1) - 1),
    }));
  };

  const hasItemQuantityChanged = (item: SaleDetailsItem) => {
    return (editedQuantities[item.id] ?? item.quantity) !== item.quantity;
  };

  const updateItemQuantity = async (item: SaleDetailsItem) => {
    if (!saleId) return;

    const quantity = editedQuantities[item.id] ?? item.quantity;
    if (quantity < 1) return;

    try {
      setSavingItemId(item.id);
      await api.put(`/sales/${item.saleId}/items/${item.productId}`, { quantity });
      await fetchSale(false);
    } catch (e) {
      handleError(e);
    } finally {
      setSavingItemId(null);
    }
  };

  const removeItem = async (item: SaleDetailsItem) => {
    if (!saleId) return;

    Alert.alert("Remover item", `Deseja remover "${item.nameSnapshot}" da venda?`, [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          try {
            setRemovingItemId(item.id);
            await api.delete(`/sales/${item.saleId}/items/${item.productId}`, {
              data: { quantity: editedQuantities[item.id] ?? item.quantity },
            });
            await fetchSale(false);
          } catch (e) {
            handleError(e);
          } finally {
            setRemovingItemId(null);
          }
        },
      },
    ]);
  };

  const confirmSale = async () => {
    if (!saleId || !sale) return;

    Alert.alert("Confirmar venda", "Deseja confirmar esta venda?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            setConfirming(true);
            await api.put(`/sales/${saleId}/confirm`);
            setCanEdit(false);
            await fetchSale(false);
          } catch (e) {
            handleError(e);
          } finally {
            setConfirming(false);
          }
        },
      },
    ]);
  };

  const cancelSale = async () => {
  if (!saleId || !sale) return;

  const proceedCancel = async () => {
    try {
      setCancelling(true);

      if (sale.status === "PAID") {
        const res = await api.get(`/payments/${saleId}`);
        const [payment] = res.data.data;

        if (!payment.id) {
         showToast("error", "Pagamento não encontrado para esta venda.");
          return;
        }

        await api.put(`/payments/${saleId}/cancel/${payment.id}`);
      } else {
        await api.put(`/sales/${saleId}/cancel`);
      }


      setCanEdit(false);
      await fetchSale(false);

    } catch (e) {
      handleError(e);
    } finally {
      setCancelling(false);
    }
  };

  if (sale.status === "PAID") {
    Alert.alert(
      "Cancelar venda",
      "Esta venda já foi paga. O pagamento será estornado e a venda cancelada. Deseja continuar?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: proceedCancel },
      ]
    );
  } else {
    Alert.alert(
      "Cancelar venda",
      "Deseja cancelar esta venda?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: proceedCancel },
      ]
    );
  }
};

  const finalizeSale = async () => {
    if (!saleId || !sale) return;

    const amount = Number(paymentAmount.replace(",", ".").trim());

    if (!paymentMethod) {
      Alert.alert("Forma de pagamento", "Selecione uma forma de pagamento.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Valor inválido", "Informe um valor de pagamento válido.");
      return;
    }

    try {
      setFinalizing(true);

      await api.post(`/payments/${saleId}`, {
        method: paymentMethod,
        amount,
      });

      setShowFinalizeModal(false);
      setCanEdit(false);
      await fetchSale(false);
    } catch (e) {
      handleError(e);
    } finally {
      setFinalizing(false);
    }
  };

  const canConfirm = !!sale && sale.status === "DRAFT" && hasItems;
  const canEditItems = !!sale && canEdit && ["DRAFT", "CONFIRMED"].includes(sale.status);
  const canFinalize = !!sale && sale.status === "CONFIRMED" && hasItems;
  const canCancel = !!sale && ["DRAFT", "CONFIRMED", "PAID"].includes(sale.status);
  const isLocked = !!sale && ["CANCELED"].includes(sale.status);

  return {
    colors,
    layout,
    router,

    saleId,
    sale,
    loading,
    refreshing,

    canEdit,
    setCanEdit,
    canStartEdit,
    isLocked,
    canEditItems,

    savingItemId,
    removingItemId,
    confirming,
    cancelling,
    finalizing,

    editedQuantities,
    increaseQuantity,
    decreaseQuantity,
    hasItemQuantityChanged,

    totalItems,
    hasItems,

    formatCurrency,
    formatDateLabel,
    formatCpf,
    formatStatus,
    getStatusColors,
    formatPaymentMethod,

    onRefresh,
    handleBack,
    updateItemQuantity,
    removeItem,
    confirmSale,
    cancelSale,
    finalizeSale,
    openFinalizeModal,

    selectedItem,
    setSelectedItem,

    canConfirm,
    canCancel,
    canFinalize,

    showFinalizeModal,
    setShowFinalizeModal,
    paymentMethod,
    setPaymentMethod,
    paymentAmount,
    setPaymentAmount,

    PaymentMethod,
  };
};

export default useEditSalesModel;