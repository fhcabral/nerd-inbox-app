import { View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import ImageUploader from "@/src/components/imageUploader/imagemUploader";
import ProductImagesCarousel from "@/src/components/productImagesCarousel";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import TextArea from "@/src/components/textArea";
import TextInputComponent from "@/src/components/textInput";
import useEditProductModel from "./models/edit-products.model";

export default function ProductDetails() {
    const model = useEditProductModel()

    return (
        <SafeScreen style={{ paddingTop: model.layout.space[5] }}>
            <Screen>
                <Header title={model.loading ? "Carregando…" : "Editar produto"} footer={`ID: ${model.productId}`} />

                {/* Form */}
                <View style={{ gap: model.layout.space[2] }}>
                    <ProductImagesCarousel
                        images={model.images}
                        canEdit={model.canEdit}
                        onDelete={model.deleteImage}
                        onReorder={model.reorderImages}
                    />
                    <TextInputComponent disabled={!model.canEdit} label="Nome" value={model.name} onChangeText={model.setName} placeholder="Nome do produto" />
                    <TextInputComponent disabled={!model.canEdit} label="Custo" value={model.cost} onChangeText={model.setCost} placeholder="Custo do produto" />

                    <View style={{ flexDirection: "row", gap: model.layout.space[2] }}>
                        <TextInputComponent keyboardType="decimal-pad" disabled={!model.canEdit} label="Preço" value={model.price} onChangeText={model.setPrice} placeholder="Digite um preço..." />
                        <TextInputComponent keyboardType="numeric" disabled={!model.canEdit} label="Estoque" value={model.stock} onChangeText={model.setStock} placeholder="Quantidade em estoque..." />
                    </View>

                    <TextArea disabled={!model.canEdit} description={model.description} setDescription={model.setDescription} placeholder="Digite uma descrição para o produto..." />
                    <ImageUploader
                        images={model.newImages}
                        setImages={model.setNewImages}
                        max={6}
                        multiple
                        disabled={!model.canEdit}
                    />
                </View>

                {/* Actions */}
                <View style={{ marginTop: model.layout.space[6], gap: model.layout.space[3] }}>
                    {!model.canEdit && <Button
                        title={"Editar"}
                        onPress={() => model.setCanEdit(true)}
                    />}

                    {model.canEdit && <Button
                        title={model.saving ? "Salvando…" : "Salvar alterações"}
                        onPress={model.onSave}
                        disabled={!model.canSave}
                    />}
                    {model.canEdit && <Button
                        title={model.deleting ? "Deletando…" : "Deletar produto"}
                        variant="secondary"
                        onPress={model.onDelete}
                        disabled={model.loading || model.saving || model.deleting}
                    />}

                    <Button title="Voltar" variant="ghost" onPress={model.handleBack} disabled={model.saving || model.deleting} />
                </View>
            </Screen>
        </SafeScreen>
    );
}