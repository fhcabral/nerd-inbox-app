import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse } from "@/src/api/types";
import { showToast } from "@/src/components/toasts";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { isPaginated } from "@/src/helpers/helper";
import { useRouter } from "expo-router";
import { useState } from "react";

export type SaleStatus = "DRAFT" | "CONFIRMED" | "PAID" | "CANCELED" | string;

export type SaleDetailsItem = {
  id: string;
  saleId: string;
  productId: string;
  nameSnapshot: string;
  skuSnapshot?: string | null;
  unitPriceSnapshot: string;
  quantity: number;
  lineTotal: string;
  createdAt: string;
  updatedAt: string;
};

export type SaleDetailsEntity = {
  id: string;
  status: SaleStatus;
  total: string;
  notes?: string | null;
  customerName?: string | null;
  customerCpf?: string | null;
  items: SaleDetailsItem[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

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

const useNewSalesModel = () => {
  const router = useRouter();
  const { colors, layout } = useTheme();

  const [saving, setSaving] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");
  const [notes, setNotes] = useState("");

  const canCreate = !saving;

  async function onCreate() {
    try {
      setSaving(true);

      const payload = {
        customerName: customerName.trim() || undefined,
        customerCpf: customerCpf.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const response = handleResponse(
        await api.post("/sales", payload)
      ) as DefaultResponse<SaleDetailsEntity>;

      if (!isPaginated<SaleDetailsEntity>(response.data)) {
        const sale = response.data;

        showToast("success", "Venda criada");
        router.push({
          pathname: "/sales/[id]",
          params: { id: sale.id },
        });
      }


    } catch (e: any) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  return {
    customerName,
    setCustomerName,
    customerCpf,
    setCustomerCpf,
    notes,
    setNotes,
    onCreate,
    canCreate,
    colors,
    layout,
    router,
    saving,
    setSaving,
    formatCurrency,
    formatDateLabel,
    formatCpf,
    formatStatus,
  };
};

export default useNewSalesModel;