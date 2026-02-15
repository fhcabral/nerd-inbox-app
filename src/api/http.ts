import { clearTokens, getTokens, setAccessToken } from "@/src/contexts/auth/tokenStorage";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.3.21:3000/api/v1",
  timeout: 10000,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(async (config) => {
  const { accessToken } = await getTokens();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!axios.isAxiosError(error) || !error.response) {
      throw error;
    }

    const status = error.response.status;

    if (status !== 401 || original?._retry) {
      throw error;
    }

    original._retry = true;

    const { refreshToken } = await getTokens();
    if (!refreshToken) {
      await clearTokens();
      throw error;
    }

    try {
      refreshPromise =
        refreshPromise ??
        (async () => {
          const r = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken },
            { timeout: 10000 }
          );

          const newAccessToken = r.data?.data?.accessToken as string | undefined;
          if (!newAccessToken) throw new Error("Missing accessToken on refresh");

          await setAccessToken(newAccessToken);
          return newAccessToken;
        })();

      const newAccess = await refreshPromise;

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newAccess}`;

      return api(original);
    } catch (e) {
      await clearTokens();
      throw e;
    } finally {
      refreshPromise = null;
    }
  }
);
