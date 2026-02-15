import { api } from "@/src/api/http";
import { showToast } from "@/src/components/toasts";
import { useAuth } from "@/src/contexts/auth/authProvider";
import { handleError } from "@/src/errors/handlerError";
import { useState } from "react";

type LoginResponse = {
  status: "success" | "error";
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

const useLoginModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("error", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      showToast("error", "Email inválido.");
      return;
    }

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = data.data;

      login({ accessToken, refreshToken });

      showToast("success", "Login realizado");
    } catch (err) {
        handleError(err)
    }
  };

  return { email, setEmail, password, setPassword, handleLogin };
};

export default useLoginModel;
