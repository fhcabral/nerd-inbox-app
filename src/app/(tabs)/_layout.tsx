import { CustomTabBar } from "@/src/components/customTabBar";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { useAuth } from "@/src/contexts/auth/authProvider";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const { isLogged, isReady } = useAuth();


  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }


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
