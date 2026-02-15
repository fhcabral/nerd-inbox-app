import Button from "@/src/components/button";
import Header from "@/src/components/header";
import KpiCard from "@/src/components/kpiCard";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

type ReportSummary = {
  gross: number;
  salesCount: number;
  avgTicket: number;
  paidCount: number;
  pendingCount: number;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Home() {
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

  return (
    <SafeScreen>
      <Screen>
        <Header />
        <KpiCard data={kpis} />
        {/* CTA */}
        <View style={{ marginTop: layout.space[4] }}>
          <Button
            title="Nova venda"
            onPress={() => router.push("/sales")}
            variant="primary"
          />
          <Button
            title="Ver vendas"
            onPress={() => router.push("/sales")}
            variant="secondary"
            style={{ marginTop: layout.space[3] }}
          />
        </View>
      </Screen>

    </SafeScreen>
  );
}
