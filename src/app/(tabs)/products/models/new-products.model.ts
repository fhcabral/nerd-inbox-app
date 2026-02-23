import { api, handleResponse } from "@/src/api/http";
import { DefaultResponse } from "@/src/api/types";
import { showToast } from "@/src/components/toasts";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { handleError } from "@/src/errors/handlerError";
import { isPaginated, parseNumberBR } from "@/src/helpers/helper";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ProductEntity } from "../types";

export type PickedImage = {
  uri: string;
  name?: string;
  type?: string;
  id: string;
};

const useNewProductModel = () => {
  const router = useRouter();
  const { colors, layout } = useTheme();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");

  const [images, setImages] = useState<PickedImage[]>([]);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length >= 2;

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

  async function onCreate() {
    if (!canSave) {
      showToast("info", "Informe pelo menos o nome do produto.");
      return;
    }

    const priceValue = price ? parseNumberBR(price) : null;
    const stockValue = stock ? parseNumberBR(stock) : null;

    if (price && priceValue === null) {
      showToast("error", "Preço inválido. Digite um valor válido. Ex: 19,90");
      return;
    }
    if (stock && stockValue === null) {
      showToast("error", "Estoque inválido. Digite um valor válido. Ex: 10");
      return;
    }

    try {
      setSaving(true);

      const body = {
        name: name.trim(),
        price: priceValue ?? "",
        stock: stockValue ?? "",
        sku: sku.trim() ? sku.trim() : "",
        description: description.trim() ? description.trim() : "",
        cost: cost
      };

      const res = handleResponse(await api.post(`/products`, body)) as DefaultResponse<ProductEntity>;

      if (!isPaginated<ProductEntity>(res.data)) {
        const created = res.data;

        if (images.length > 0) {
          try {
            await uploadProductImages(created.id, images);
          } catch (e) {
            handleError(e);
          }
        }

        showToast("success", "Produto criado com sucesso.");
        router.replace({
          pathname: "/products/[id]",
          params: { id: created.id },
        });
      }
    } catch (e: unknown) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    setName,
    price,
    setPrice,
    stock,
    setStock,
    description,
    setDescription,
    onCreate,
    saving,
    setSaving,
    colors,
    layout,
    router,
    canSave,
    sku,
    setSku,
    images,  
    setImages, 
    cost,
    setCost
  };
};

export default useNewProductModel;