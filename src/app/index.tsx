import { Redirect } from "expo-router";

export default function Index() {
  const isLogged = false;

  return isLogged
    ? <Redirect href="/(tabs)/home" />
    : <Redirect href="/(auth)/login" />;
}
