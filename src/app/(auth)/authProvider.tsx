import React, { createContext, useContext, useMemo, useState } from "react";

type AuthState = {
  isLogged: boolean;
  token: string | null;
};

type AuthContextValue = AuthState & {
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isLogged: !!token,
      token,
      login: (newToken: string) => setToken(newToken),
      logout: () => setToken(null),
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
