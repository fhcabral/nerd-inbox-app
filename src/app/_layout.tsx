import { AuthProvider } from "@/src/contexts/authProvider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useTheme } from "../components/theme/useTheme";
import { makeToastConfig } from "../components/toasts/toast.config";

export default function RootLayout() {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={makeToastConfig(theme)} position="bottom" />
        </>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
