import { useTheme } from "@/src/contexts/theme/useTheme";
import { formatBRL } from "@/src/helpers/helper";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ReportSummary } from "./types";

export default function useHomeModel() {
    const { layout } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ReportSummary | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        // TODO: troca pela tua baseURL / client. Ex:
        // const res = await api.get("/summary?from=...&to=...");
        const res = await fetch("http://SEU_HOST/api/v1/summary"); // 👈 ajusta
        const json = await res.json();

        // assumindo responseJson -> { ok: true, data: ... } ou { data: ... }
        const data = json.data ?? json;

        if (mounted) setSummary(data);
      } catch (e) {
        if (mounted) setSummary(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
  }, []);

  const kpis = useMemo(() => {
      const s = summary ?? {
        gross: 0,
        salesCount: 0,
        avgTicket: 0,
        paidCount: 0,
        pendingCount: 0,
      };
  
      return [
        { label: "Faturamento", value: formatBRL(s.gross) },
        { label: "Pagas", value: String(s.paidCount) },
        { label: "Pendentes", value: String(s.pendingCount) },
        { label: "Ticket médio", value: formatBRL(s.avgTicket) },
      ];
    }, [summary]);

    return {
        kpis,
        loading,
        router,
        layout
    }
}