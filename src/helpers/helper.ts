import { PaginatedResponse } from "../api/types";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
const isPaginated = <T>(
  payload: PaginatedResponse<T> | T
): payload is PaginatedResponse<T> => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as any).data) &&
    "meta" in payload
  );
};

function formatInputNumber(n?: number) {
    if (typeof n !== "number") return "";
    const s = String(n);
    return s.includes(".") ? s.replace(".", ",") : s;
}

function parseNumberBR(input: string) {
    const cleaned = input.replace(/\s/g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
}

export { formatBRL, formatInputNumber, isPaginated, parseNumberBR };

