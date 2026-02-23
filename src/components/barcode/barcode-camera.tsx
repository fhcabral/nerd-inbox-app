import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/theme/useTheme"; // ajuste o caminho

type Props = {
  visible: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
};

export default function BarcodeScannerModal({ visible, onClose, onScanned }: Props) {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (!visible) setLock(false);
    if (visible && !permission?.granted) requestPermission();
  }, [visible]);

  const handleScan = (res: BarcodeScanningResult) => {
    if (lock) return;
    setLock(true);

    const code = (res.data ?? "").trim();
    if (code) onScanned(code);
    onClose();
  };

  const ui = useMemo(() => makeStyles(colors.primary), [colors.primary]);

  if (!visible) return null;
  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={ui.permissionWrap}>
          <Text style={ui.permissionText}>
            Preciso de permissão da câmera pra ler o código de barras.
          </Text>

          <Pressable onPress={requestPermission} style={ui.permissionBtn}>
            <Text style={ui.permissionBtnText}>Permitir câmera</Text>
          </Pressable>

          <Pressable onPress={onClose} style={ui.cancelBtn}>
            <Text style={ui.cancelBtnText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} facing="back" onBarcodeScanned={handleScan} />

        {/* Overlay do scanner */}
        <View pointerEvents="none" style={ui.overlay}>
          <View style={ui.maskTop} />
          <View style={ui.middleRow}>
            <View style={ui.maskSide} />

            <View style={ui.frame}>
              {/* cantos */}
              <View style={[ui.corner, ui.tl]} />
              <View style={[ui.corner, ui.tr]} />
              <View style={[ui.corner, ui.bl]} />
              <View style={[ui.corner, ui.br]} />

              {/* linha “scan” */}
              <View style={ui.scanLine} />
            </View>

            <View style={ui.maskSide} />
          </View>
          <View style={ui.maskBottom}>
            <Text style={ui.hint}>Alinhe o código dentro da área</Text>
          </View>
        </View>

        {/* botão fechar (com cor do tema) */}
        <Pressable onPress={onClose} style={ui.closeBtn}>
          <Text style={ui.closeBtnText}>Fechar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function makeStyles(primary: string) {
  const mask = "rgba(0,0,0,0.55)";

  // janela central (pode ajustar)
  const frameW = 280;
  const frameH = 180;
  const cornerSize = 26;
  const cornerThickness = 4;

  return {
    overlay: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    } as const,

    maskTop: {
      flex: 1,
      backgroundColor: mask,
    } as const,

    middleRow: {
      flexDirection: "row",
      alignItems: "center",
    } as const,

    maskSide: {
      flex: 1,
      backgroundColor: mask,
      height: frameH,
    } as const,

    frame: {
      width: frameW,
      height: frameH,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      backgroundColor: "transparent",
      overflow: "hidden",
    } as const,

    // cantos (4 L-shapes)
    corner: {
      position: "absolute",
      width: cornerSize,
      height: cornerSize,
      borderColor: primary,
    } as const,

    tl: {
      top: 10,
      left: 10,
      borderTopWidth: cornerThickness,
      borderLeftWidth: cornerThickness,
      borderTopLeftRadius: 10,
    } as const,

    tr: {
      top: 10,
      right: 10,
      borderTopWidth: cornerThickness,
      borderRightWidth: cornerThickness,
      borderTopRightRadius: 10,
    } as const,

    bl: {
      bottom: 10,
      left: 10,
      borderBottomWidth: cornerThickness,
      borderLeftWidth: cornerThickness,
      borderBottomLeftRadius: 10,
    } as const,

    br: {
      bottom: 10,
      right: 10,
      borderBottomWidth: cornerThickness,
      borderRightWidth: cornerThickness,
      borderBottomRightRadius: 10,
    } as const,

    scanLine: {
      position: "absolute",
      left: 14,
      right: 14,
      top: "50%",
      height: 2,
      borderRadius: 2,
      backgroundColor: primary,
      opacity: 0.9,
    } as const,

    maskBottom: {
      flex: 1,
      backgroundColor: mask,
      alignItems: "center",
      paddingTop: 18,
    } as const,

    hint: {
      color: "rgba(255,255,255,0.9)",
      fontSize: 14,
    } as const,

    closeBtn: {
      position: "absolute",
      top: 50,
      left: 20,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: "rgba(0,0,0,0.55)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    } as const,

    closeBtnText: {
      color: "white",
      fontSize: 14,
    } as const,

    // permissão
    permissionWrap: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: "black",
    } as const,

    permissionText: {
      color: "white",
      marginBottom: 12,
      fontSize: 14,
      opacity: 0.9,
    } as const,

    permissionBtn: {
      padding: 14,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: primary,
      backgroundColor: "rgba(0,0,0,0.35)",
    } as const,

    permissionBtnText: {
      color: "white",
      textAlign: "center",
      fontWeight: "600",
    } as const,

    cancelBtn: {
      padding: 14,
      marginTop: 10,
      borderRadius: 12,
    } as const,

    cancelBtnText: {
      color: "rgba(255,255,255,0.85)",
      textAlign: "center",
    } as const,
  };
}