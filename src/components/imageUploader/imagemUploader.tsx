import { showToast } from "@/src/components/toasts";
import { useTheme } from "@/src/contexts/theme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { PickedImage } from "../../app/(tabs)/products/models/new-products.model";

type Props = {
  label?: string;
  images: PickedImage[];
  setImages: (imgs: PickedImage[]) => void;
  max?: number;
  multiple?: boolean;
  disabled?: boolean;
};

export default function ImageUploader({
  label = "Imagens",
  images,
  setImages,
  max = 6,
  multiple = true,
  disabled = false,
}: Props) {
  const { colors, layout } = useTheme();

  const ui = useMemo(() => {
    const radius = layout?.radius?.md ?? 12;
    const borderW = layout?.borderWidth?.lg ?? 1;

    return {
      label: { fontSize: 12, color: colors.primary, marginBottom: 6 } as const,
      row: { gap: 10 } as const,
      addBtn: {
        height: 48,
        borderRadius: radius,
        borderWidth: borderW,
        borderColor: colors.borderStrong,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
      } as const,
      addBtnText: { color: colors.text, fontSize: 14 } as const,
      hint: { color: colors.textMuted, fontSize: 12, marginTop: 6 } as const,

      thumbs: { marginTop: 10 } as const,
      thumb: {
        width: 82,
        height: 82,
        borderRadius: radius,
        borderWidth: borderW,
        borderColor: colors.borderStrong,
        overflow: "hidden",
      } as const,
      remove: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(0,0,0,0.55)",
        alignItems: "center",
        justifyContent: "center",
      } as const,
      emptyText: { color: colors.textMuted, fontSize: 12 } as const,
      disabled: {
        opacity: 0.5,
      } as const,

      addBtnDisabled: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      } as const,

      addBtnTextDisabled: {
        color: colors.textMuted,
      } as const,
    };
  }, [colors, layout]);

  async function pick() {
    if (images.length >= max) {
      showToast("info", `Limite de ${max} imagens.`);
      return;
    }

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showToast("error", "Permissão para acessar suas fotos foi negada.");
      return;
    }

    const remaining = max - images.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multiple,
      selectionLimit: multiple ? remaining : 1,
      quality: 0.85,
    });

    if (result.canceled) return;

    const picked: PickedImage[] = result.assets.map((a) => ({
      uri: a.uri,
      name: a.fileName ?? `image-${Date.now()}.jpg`,
      type: a.mimeType ?? "image/jpeg",
      id: a.assetId ?? a.uri,
    }));

    // evita duplicar o mesmo uri
    const merged = [...images, ...picked].filter(
      (img, idx, arr) => arr.findIndex((x) => x.uri === img.uri) === idx
    );

    setImages(merged.slice(0, max));
  }

  function remove(uri: string) {
    setImages(images.filter((i) => i.uri !== uri));
  }

  return (
    <View>
      <Text style={ui.label}>{label}</Text>

      <Pressable
        onPress={pick}
        disabled={disabled}
        style={[
          ui.addBtn,
          disabled ? ui.addBtnDisabled : null,
        ]}
      >
        <Ionicons
          name="image-outline"
          size={18}
          color={disabled ? colors.textMuted : colors.primary}
        />
        <Text
          style={[
            ui.addBtnText,
            disabled ? ui.addBtnTextDisabled : null,
          ]}
        >
          Adicionar imagem
        </Text>
      </Pressable>

      <Text style={ui.hint}>
        {images.length}/{max} selecionadas
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={ui.thumbs}
        contentContainerStyle={ui.row}
      >
        {images.length === 0 ? (
          <Text style={ui.emptyText}>Nenhuma imagem selecionada.</Text>
        ) : (
          images.map((img) => (
            <View key={img.uri} style={ui.thumb}>
              <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%" }} />
              <Pressable
                onPress={() => remove(img.uri)}
                disabled={disabled}
                style={[
                  ui.remove,
                  disabled ? ui.disabled : null,
                ]}
              >
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}