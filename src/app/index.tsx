import { useAuth } from "@/src/app/(auth)/authProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLogged } = useAuth();

  return isLogged ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
