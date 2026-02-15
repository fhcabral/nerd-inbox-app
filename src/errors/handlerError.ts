import { showToast } from "@/src/components/toasts";
import axios from "axios";
import { ERROR_MESSAGES, ERROR_TRANSLATE } from "./errorMessages";

export function handleError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      showToast("error", ERROR_MESSAGES.NETWORK_ERROR);
      return;
    }

    const status = error.response.status;
    const backendMessage =
      (error.response.data as any)?.message as string | undefined;

    const hasBackendMessageTranslate = backendMessage && ERROR_TRANSLATE[backendMessage] ? ERROR_TRANSLATE[backendMessage] : backendMessage;

    showToast(
      "error",
       hasBackendMessageTranslate ||
        ERROR_MESSAGES[status] ||
        ERROR_MESSAGES.UNKNOWN
    );
    return;
  }

  showToast("error", ERROR_MESSAGES.UNKNOWN);
}
