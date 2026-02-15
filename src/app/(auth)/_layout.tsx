import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
   <SafeScreen>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  </SafeScreen>
  );
}
