import { useAuth } from "@/src/contexts/auth/authProvider";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLogged, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return isLogged ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
