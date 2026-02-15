import { CustomTabBar } from "@/src/components/customTabBar";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { useAuth } from "@/src/contexts/authProvider";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isLogged } = useAuth();
  if (!isLogged) return <Redirect href="/login" />;

  return (
    <SafeScreen>
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="products" options={{ title: "Produtos" }} />
      <Tabs.Screen name="sales" options={{ title: "Vendas" }} />
      <Tabs.Screen name="settings" options={{ title: "Config" }} />
    </Tabs>
    </SafeScreen>
  );
}
