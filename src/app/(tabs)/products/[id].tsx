import { View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import TextArea from "@/src/components/textArea";
import TextInputComponent from "@/src/components/textInput";
import useEditProductModel from "./models/edit-products.model";

export default function ProductDetails() {
    const { canSave,
        colors,
        cost,
        deleting,
        description,
        layout,
        loading,
        name,
        onBack,
        price,
        onDelete,
        onSave,
        productId,
        saving,
        setCost,
        setDescription,
        setName,
        setPrice,
        reload,
        setStock,
        stock,
        router
    } = useEditProductModel()

    return (
        <SafeScreen style={{ paddingTop: layout.space[5] }}>
            <Screen>
                <Header title={loading ? "Carregando…" : "Editar produto"} footer={`ID: ${productId}`} />

                {/* Form */}
                <View style={{ gap: layout.space[2] }}>
                    <TextInputComponent label="Nome" value={name} onChangeText={setName} placeholder="Nome do produto" />
                    <TextInputComponent label="Custo" value={cost} onChangeText={setCost} placeholder="Custo do produto" />

                    <View style={{ flexDirection: "row", gap: layout.space[2] }}>
                        <TextInputComponent label="Preço" value={price} placeholder="Digite um preço..." />
                        <TextInputComponent label="Estoque" value={stock} placeholder="Quantidade em estoque..." />
                    </View>

                    <TextArea description={description} setDescription={setDescription} placeholder="Digite uma descrição para o produto..." />
                </View>

                {/* Actions */}
                <View style={{ marginTop: layout.space[6], gap: layout.space[3] }}>
                    <Button
                        title={saving ? "Salvando…" : "Salvar alterações"}
                        onPress={onSave}
                        disabled={!canSave}
                    />
                    <Button
                        title={deleting ? "Deletando…" : "Deletar produto"}
                        variant="secondary"
                        onPress={onDelete}
                        disabled={loading || saving || deleting}
                    />
                    <Button title="Voltar" variant="ghost" onPress={() => router.back()} disabled={saving || deleting} />
                </View>

                <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[6] }}>
                    Próximo: gerenciamento de imagens (upload / principal / reorder).
                </Text>
            </Screen>
        </SafeScreen>
    );
}