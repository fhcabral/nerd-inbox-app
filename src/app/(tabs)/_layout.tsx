import { SafeScreen } from "@/src/components/safeAreaScreen";
import { useAuth } from "@/src/contexts/authProvider";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isLogged } = useAuth();
  if (!isLogged) return <Redirect href="/login" />;
  
  return (
    <SafeScreen>
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  </SafeScreen>
  );
}
