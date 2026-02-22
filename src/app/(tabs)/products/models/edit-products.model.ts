import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse } from "@/src/api/types";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { formatInputNumber, isPaginated, parseNumberBR } from "@/src/helpers/helper"; // ajuste imports conforme teu projeto
import type { ProductEntity } from "../types";

const useEditProductModel = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, layout } = useTheme();

  const productId = useMemo(() => (typeof id === "string" ? id : ""), [id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const canSave = name.trim().length >= 2 && !loading && !saving && !deleting;

  async function load() {
    if (!productId) return;

    try {
      setLoading(true);

      const res = handleResponse(
        await api.get(`/products/${productId}`)
      ) as DefaultResponse<ProductEntity>;

      if (isPaginated<ProductEntity>(res.data)) {
        throw new Error("Endpoint de produto por id não deveria retornar paginado");
      }

      const product = res.data;

      setName(product.name ?? "");
      setCost(formatInputNumber(Number(product.cost)));
      setPrice(formatInputNumber(Number(product.price)));
      setStock(
        formatInputNumber(
          typeof product.stock === "number" ? product.stock : Number(product.stock)
        )
      );
      setDescription((product as any).description ?? "");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível carregar o produto.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function onSave() {
    const priceValue = price ? parseNumberBR(price) : null;
    const stockValue = stock ? parseNumberBR(stock) : null;
    const costValue = cost ? parseNumberBR(cost) : null;

    if (price && priceValue === null) {
      Alert.alert("Preço inválido", "Digite um valor válido. Ex: 19,90");
      return;
    }
    if (cost && costValue === null) {
      Alert.alert("Custo inválido", "Digite um valor válido. Ex: 10,00");
      return;
    }
    if (stock && stockValue === null) {
      Alert.alert("Estoque inválido", "Digite um valor válido. Ex: 10");
      return;
    }

    try {
      setSaving(true);

      const body = {
        name: name.trim(),
        cost: costValue ?? undefined,
        price: priceValue ?? undefined,
        stock: stockValue ?? undefined,
        description: description.trim() ? description.trim() : undefined,
      };

      const res = handleResponse(
        await api.put(`/products/${productId}`, body)
      ) as DefaultResponse<ProductEntity>;

      if (!isPaginated<ProductEntity>(res.data)) {
        const updated = res.data;

        setName(updated.name ?? name);
        setCost(formatInputNumber(Number(updated.cost)));
        setPrice(formatInputNumber(Number(updated.price)));
        setStock(
          formatInputNumber(
            typeof updated.stock === "number" ? updated.stock : Number(updated.stock)
          )
        );
        setDescription((updated as any).description ?? description);
      }

      Alert.alert("Salvo", res.message ?? "Produto atualizado com sucesso.");
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Não foi possível salvar.";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  function onDelete() {
    Alert.alert("Deletar produto", "Tem certeza? Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);

            const res = handleResponse(
              await api.delete(`/products/${productId}`)
            ) as DefaultResponse<unknown>;

            Alert.alert("Ok", res.message ?? "Produto deletado.");
            router.replace("/products");
          } catch (e: any) {
            const msg =
              e?.response?.data?.message ?? e?.message ?? "Não foi possível deletar.";
            Alert.alert("Erro", msg);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  }

  return {
    // theme/helpers
    colors,
    layout,
    productId,

    // state
    loading,
    saving,
    deleting,
    canSave,
    router,

    name,
    setName,
    cost,
    setCost,
    price,
    setPrice,
    stock,
    setStock,
    description,
    setDescription,

    // actions
    reload: load,
    onSave,
    onDelete,
    onBack: () => router.back(),
  };
};

export default useEditProductModel;