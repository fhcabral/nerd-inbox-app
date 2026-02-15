import { clearTokens, getTokens, setTokens } from "@/src/contexts/auth/tokenStorage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Tokens = { accessToken: string; refreshToken: string };

type AuthContextValue = {
  isLogged: boolean;
  isReady: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokens: Tokens) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (accessToken: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await getTokens();
      setAccessTokenState(t.accessToken);
      setRefreshTokenState(t.refreshToken);
      setIsReady(true);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isReady,
      isLogged: !!accessToken,
      accessToken,
      refreshToken,

      login: async (tokens) => {
        setAccessTokenState(tokens.accessToken);
        setRefreshTokenState(tokens.refreshToken);
        await setTokens(tokens);
      },

      logout: async () => {
        setAccessTokenState(null);
        setRefreshTokenState(null);
        await clearTokens();
      },

      setAccessToken: (newAccessToken: string) => {
        setAccessTokenState(newAccessToken);
      },
    };
  }, [accessToken, refreshToken, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
