import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { PickedImage } from "@/src/app/(tabs)/products/models/new-products.model";
import Button from "@/src/components/button";
import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";
import Header from "../header";
import { styles } from "./styles";

type Props = {
  images: PickedImage[];
  canEdit: boolean;
  onDelete: (imageId: string) => Promise<void> | void;
  onReorder: (orderIds: string[]) => Promise<void> | void;
};

export default function ProductImagesCarousel({
  images,
  canEdit,
  onDelete,
  onReorder,
}: Props) {
  const { colors, layout } = useTheme();
  const ui = useMemo(() => styles(colors, layout), [colors, layout]);
  const { width } = useWindowDimensions();

  const horizontalPadding = layout.space[5] * 2;
  const pageWidth = width - horizontalPadding;

  const [reorderOpen, setReorderOpen] = useState(false);
  const [localImages, setLocalImages] = useState<PickedImage[]>(images);

  React.useEffect(() => setLocalImages(images), [images]);

  function confirmDelete(imageId: string) {
    Alert.alert(
      "Remover imagem?",
      "Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            await onDelete(imageId);
          },
        },
      ]
    );
  }

  async function saveReorder() {
    const orderIds = localImages.map((i) => i.id);
    await onReorder(orderIds);
    setReorderOpen(false);
  }

  const renderCarouselItem = ({ item, index }: { item: PickedImage; index: number }) => (
    <View style={{ width: pageWidth }}>
      <View style={ui.bigFrame}>
        <Image source={{ uri: item.uri }} style={ui.bigImage} resizeMode="cover" />

        {index === 0 && (
          <View style={ui.primaryBadge}>
            <Text variant="caption" style={ui.primaryBadgeText}>Principal</Text>
          </View>
        )}

        {canEdit && (
          <Pressable onPress={() => confirmDelete(item.id)} style={ui.deleteBtn} hitSlop={10}>
            <Ionicons name="close" size={18} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderReorderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<PickedImage>) => {
  const index = getIndex?.() ?? localImages.findIndex((i) => i.id === item.id);

  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={drag}          // ✅ mais estável que Pressable onPressIn
        delayLongPress={150}        // ✅ dá tempo do GH “assumir”
        disabled={!canEdit}
        style={[ui.reorderItem, isActive ? ui.reorderActive : null]}
      >
        <Image source={{ uri: item.uri }} style={ui.reorderThumb} />

        <View style={ui.reorderInfo}>
          <Text variant="caption" style={{ color: colors.text }}>
            {index === 0 ? "Principal" : `Posição ${index}`}
          </Text>
          <Text variant="caption" style={{ color: colors.textMuted }}>
            Segure e arraste
          </Text>
        </View>

        {canEdit && (
          // ⚠️ aqui a gente precisa impedir do botão roubar o long press do item
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => confirmDelete(item.id)}
            style={ui.reorderDelete}
          >
            <Ionicons name="trash-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

  return (
    <View style={{ gap: layout.space[2] }}>
      <View style={ui.headerRow}>
        <Text variant="caption" style={{ color: colors.primary }}>
          Imagens
        </Text>

        {canEdit && localImages.length > 1 && (
          <Pressable onPress={() => setReorderOpen(true)} style={ui.reorderBtn}>
            <Ionicons name="swap-vertical" size={16} color={colors.primary} />
            <Text variant="caption" style={ui.reorderBtnText}>Reordenar</Text>
          </Pressable>
        )}
      </View>

      {/* Carrossel grande */}
      {localImages.length ? (
        <FlatList
          data={localImages}
          keyExtractor={(i) => i.id}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={pageWidth}     // ✅ garante snapping certo
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
        />
      ) : (
        <View style={ui.bigFrameEmpty}>
          <Text variant="caption" style={{ color: colors.textMuted }}>
            Sem imagens
          </Text>
        </View>
      )}

      {/* Modal de reordenação */}
      <Modal visible={reorderOpen} animationType="slide" onRequestClose={() => setReorderOpen(false)}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "bottom"]}>
            <View style={ui.modalWrap}>
              <Header title="Reordenar imagens" footer="A posição 0 vira a imagem principal." />

              <DraggableFlatList
                data={localImages}
                keyExtractor={(i) => i.id}
                onDragEnd={({ data }) => setLocalImages(data)}
                renderItem={renderReorderItem}
                activationDistance={8}
                containerStyle={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: layout.space[6] }}
              />

              <View style={ui.modalFooter}>
                <Button title="Cancelar" variant="ghost" onPress={() => setReorderOpen(false)} />
                <Button title="Salvar ordem" onPress={saveReorder} variant="primary" />
              </View>
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}