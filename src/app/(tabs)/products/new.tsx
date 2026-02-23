import { Screen } from "@/src/components/screen";
import { View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import ImageUploader from "@/src/components/imageUploader/imagemUploader";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import TextArea from "@/src/components/textArea";
import TextInputComponent, { LabelType } from "@/src/components/textInput";
import useNewProductModel from "./models/new-products.model";

export default function NewProduct() {
    const {
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
        colors,
        layout,
        router,
        canSave,
        sku,
        setSku,
        images,
        setImages,
        cost,
        setCost,
    } = useNewProductModel();
    return (
        <SafeScreen>
            <Screen>
                <Header footer="Preecha os campos e salve" title="Novo produto" />

                {/* Form */}
                <View style={{ gap: layout.space[3] }}>
                    <TextInputComponent label="Nome" placeholder="Ex: Figure Goku SSJ" value={name} onChangeText={setName} />
                    <TextInputComponent label="SKU" placeholder="Ex: Código de barras" value={sku} onChangeText={setSku} labelType={LabelType.BARCODE} />
                    <TextInputComponent keyboardType="numeric" label="Custo (Opcional)" placeholder="Digite o custo..." value={cost} onChangeText={setCost} />
                    <View style={{ flexDirection: "row", gap: layout.space[3] }}>
                        <TextInputComponent keyboardType="decimal-pad" label="Preço" placeholder="Digite o preço..." value={price} onChangeText={setPrice} />
                        <TextInputComponent keyboardType="numeric" label="Estoque" placeholder="Digite o estoque..." value={stock} onChangeText={setStock} />
                    </View>
                    <TextArea description={description} setDescription={setDescription} placeholder="Descrição do produto (opcional)" />
                    <ImageUploader
                        images={images}
                        setImages={setImages}
                        max={6}
                        multiple
                    />
                </View>

                {/* Actions */}
                <View style={{ marginTop: layout.space[6], gap: layout.space[3] }}>
                    <Button isLoading={saving} title={saving ? "Salvando…" : "Criar produto"} onPress={onCreate} disabled={!canSave || saving} />
                    <Button title="Cancelar" variant="secondary" onPress={() => router.back()} disabled={saving} />
                </View>
            </Screen>
        </SafeScreen>
    );
}
