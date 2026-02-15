import { showToast } from "@/src/components/toasts";
import { useAuth } from "@/src/contexts/authProvider";
import { useState } from "react";

const useLoginModel = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleLogin = () => {
        if (!email || !password) {
            showToast("error", "Por favor, preencha todos os campos.");
            return;
        }


        if (!validateEmail(email)) {
            showToast("error", "Email inválido. Por favor, insira um email válido.");
            return;
        }

        const fakeToken = "token_123";

        login(fakeToken);
        showToast("success", "Login realizado");
    }


    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin
    }
}

export default useLoginModel;