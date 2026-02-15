import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  access: "@auth/accessToken",
  refresh: "@auth/refreshToken",
} as const;

export async function getTokens() {
  const [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem(KEYS.access),
    AsyncStorage.getItem(KEYS.refresh),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

export async function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  await Promise.all([
    AsyncStorage.setItem(KEYS.access, tokens.accessToken),
    AsyncStorage.setItem(KEYS.refresh, tokens.refreshToken),
  ]);
}

export async function setAccessToken(accessToken: string) {
  await AsyncStorage.setItem(KEYS.access, accessToken);
}

export async function clearTokens() {
  await Promise.all([
    AsyncStorage.removeItem(KEYS.access),
    AsyncStorage.removeItem(KEYS.refresh),
  ]);
}
