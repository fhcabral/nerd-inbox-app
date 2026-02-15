import { useAuth } from "@/src/app/(auth)/authProvider";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isLogged } = useAuth();
  if (isLogged) return <Redirect href="/home" />;
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
