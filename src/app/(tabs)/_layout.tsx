import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Tabs } from "expo-router";


export default function TabsLayout() {
  return (
    <SafeScreen>
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  </SafeScreen>
  );
}
