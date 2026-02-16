import { AuthProvider } from "@/src/contexts/auth/authProvider";
import { useTheme } from "@/src/contexts/theme/useTheme";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { makeToastConfig } from "../components/toasts/toast.config";
import { ThemeProvider } from "../contexts/theme/themeProvider";

function RootInner() {
  const theme = useTheme();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.bg);
    NavigationBar.setButtonStyleAsync("light"); 
  }, [theme.colors.bg]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={makeToastConfig(theme)} position="bottom" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <RootInner />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
