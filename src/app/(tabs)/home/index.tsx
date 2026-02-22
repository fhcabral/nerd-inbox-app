import Button from "@/src/components/button";
import Header from "@/src/components/header";
import KpiCard from "@/src/components/kpiCard";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import { View } from "react-native";
import HomeModel from "./home.model";

export default function Home() {
  const { kpis, loading, router, layout } = HomeModel();

  return (
    <SafeScreen>
      <Screen>
        <Header title={'Resumo'} footer={'Veja seus insights principais'} />
        <KpiCard data={kpis} />
        <View style={{ marginTop: layout.space[4] }}>
          <Button
            title="Nova venda"
            onPress={() => router.push({
              pathname: "/sales/new",
            })}

            variant="primary"
          />
          <Button
            title="Ver vendas"
            onPress={() => router.push({
              pathname: "/sales",
            })}
            variant="secondary"
            style={{ marginTop: layout.space[3] }}
          />
        </View>
      </Screen>
    </SafeScreen>
  );
}
