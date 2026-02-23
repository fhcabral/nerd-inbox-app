import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { api, handleResponse } from "@/src/api/http";
import type { DefaultResponse } from "@/src/api/types";
import { showToast } from "@/src/components/toasts";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { formatInputNumber, isPaginated, parseNumberBR } from "@/src/helpers/helper"; // ajuste imports conforme teu projeto
import type { ProductEntity } from "../types";
import type { PickedImage } from "./new-products.model";

const useEditProductModel = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, layout } = useTheme();
  const [images, setImages] = useState<PickedImage[]>([]);
  const [newImages, setNewImages] = useState<PickedImage[]>([]);

  const productId = useMemo(() => (typeof id === "string" ? id : ""), [id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [initialData, setInitialData] = useState({
    name: "",
    cost: "",
    price: "",
    stock: "",
    description: "",
  });

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
      if (product?.images) setImages(product.images.map(img => ({ uri: img.url, id: img.id })));

      setName(product.name ?? "");
      setCost(formatInputNumber(Number(product.cost)));
      setPrice(formatInputNumber(Number(product.price)));
      setStock(
        formatInputNumber(
          typeof product.stock === "number" ? product.stock : Number(product.stock)
        )
      );
      setDescription((product as any).description ?? "");

      setInitialData({
        name: product.name,
        cost: formatInputNumber(Number(product.cost)),
        price: formatInputNumber(Number(product.price)),
        stock: formatInputNumber(
          typeof product.stock === "number" ? product.stock : Number(product.stock)
        ),
        description: product.description ?? "",
      });
    } catch (e: any) {
      handleError(e)
    } finally {
      setLoading(false);
    }
  }

  async function uploadProductImages(productId: string, imgs: PickedImage[]) {
    await Promise.all(
      imgs.map(async (img, index) => {
        const form = new FormData();

        form.append("file", {
          uri: img.uri,
          name: img.name ?? `product-${productId}-${index}.jpg`,
          type: img.type ?? "image/jpeg",
        } as any);

        await api.post(`/products/${productId}/images`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      })
    );
  }


  async function deleteImage(imageId: string) {
    try {
      await api.delete(`/products/${productId}/images/${imageId}`);
      setImages((prev) => prev.filter((i) => i.id !== imageId));
      showToast("success", "Imagem removida.");
    } catch (e) {
      handleError(e);
    }
  }

  async function reorderImages(orderIds: string[]) {
    try {
      await api.put(`/products/${productId}/images/reorder`, { orderIds });

      setImages((prev) => {
        const map = new Map(prev.map((i) => [i.id, i]));
        return orderIds.map((id) => map.get(id)!).filter(Boolean);
      });

      showToast("success", "Ordem das imagens atualizada.");
    } catch (e) {
      handleError(e);
    }
  }

  useEffect(() => {
    load();
  }, [productId]);

  async function onSave() {
    const priceValue = price ? parseNumberBR(price) : null;
    const stockValue = stock ? parseNumberBR(stock) : null;
    const costValue = cost ? parseNumberBR(cost) : null;

    if (price && priceValue === null) {
      showToast("info", "Digite um valor válido. Ex: 19,90");
      return;
    }
    if (cost && costValue === null) {
      showToast("info", "Digite um valor válido. Ex: 10,00");
      return;
    }
    if (stock && stockValue === null) {
      showToast("info", "Digite um valor válido. Ex: 10");
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
        if (newImages.length > 0) {
          try {
            await uploadProductImages(updated.id, newImages);
            setNewImages([]);
          } catch (e) {
            handleError(e);
          }
        }

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

      showToast("success", res.message ?? "Produto atualizado com sucesso.");
    } catch (e: any) {
      handleError(e)
    } finally {
      setSaving(false);
      await load();
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

            showToast("success", res.message ?? "Produto deletado.");
            router.replace("/products");
          } catch (e: any) {
            const msg =
              e?.response?.data?.message ?? e?.message ?? "Não foi possível deletar.";
            showToast("error", msg);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  }

  const handleBack = () => {
    const isDirty =
      name !== initialData.name ||
      cost !== initialData.cost ||
      price !== initialData.price ||
      stock !== initialData.stock ||
      description !== initialData.description;

    if (isDirty) {
      Alert.alert("Sair sem salvar?", "Você tem alterações não salvas. Tem certeza que deseja sair?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
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
    canEdit,
    setCanEdit,

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
    images,
    deleteImage,
    reorderImages,
    newImages,
    setNewImages,

    // actions
    reload: load,
    onSave,
    onDelete,
    onBack: () => router.back(),
    handleBack
  };
};

export default useEditProductModel;