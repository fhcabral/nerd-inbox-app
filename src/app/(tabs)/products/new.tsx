import { Screen } from "@/src/components/screen";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, TextInput, View } from "react-native";

import Button from "@/src/components/button";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";

type ProductEntity = {
    id: string;
    name: string;
    price?: number;
    stock?: number;
    description?: string | null;
};

type ApiResponse<T> = {
    data: T;
    message?: string;
    ok?: boolean;
};

const BASE_URL = "http://SEU_HOST/api/v1"; // 👈 troca

function parseNumberBR(input: string) {
    // aceita "12,50" e "12.50"
    const cleaned = input.replace(/\s/g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
}

export default function NewProduct() {
    const router = useRouter();
    const { colors, layout } = useTheme();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(""); // string no input
    const [stock, setStock] = useState(""); // string no input
    const [description, setDescription] = useState("");

    const [saving, setSaving] = useState(false);

    const canSave = name.trim().length >= 2;

    async function onCreate() {
        if (!canSave) {
            Alert.alert("Ops", "Informe pelo menos o nome do produto.");
            return;
        }

        const priceValue = price ? parseNumberBR(price) : null;
        const stockValue = stock ? parseNumberBR(stock) : null;

        if (price && priceValue === null) {
            Alert.alert("Preço inválido", "Digite um valor válido. Ex: 19,90");
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
                price: priceValue ?? undefined,
                stock: stockValue ?? undefined,
                description: description.trim() ? description.trim() : undefined,
            };

            const res = await fetch(`${BASE_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`, // 👈 se precisar
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Erro ao criar produto");
            }

            const json: ApiResponse<ProductEntity> = await res.json();
            const created = json.data ?? (json as any);

            Alert.alert("Sucesso", "Produto criado com sucesso.");
            // vai pra tela do produto recém criado
            router.replace({
                pathname: "/products/[id]",
                params: { id: created.id },
            });

        } catch (e: any) {
            Alert.alert("Erro", e?.message ?? "Não foi possível criar o produto.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <SafeScreen>
            <Screen>


                {/* Header */}
                <View style={{ marginBottom: layout.space[5] }}>
                    <Text variant="heading">Novo produto</Text>
                    <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[1] }}>
                        Preencha os campos e salve
                    </Text>
                </View>

                {/* Form */}
                <View style={{ gap: layout.space[3] }}>
                    <View>
                        <Text variant="caption" style={{ color: colors.textMuted, marginBottom: layout.space[1] }}>
                            Nome
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Figure Goku SSJ"
                            placeholderTextColor={colors.textMuted}
                            style={{
                                height: 48,
                                borderRadius: layout.radius.md,
                                paddingHorizontal: layout.space[4],
                                borderWidth: layout.borderWidth.hairline,
                                borderColor: colors.borderStrong,
                                backgroundColor: colors.surface2,
                                color: colors.text,
                                fontSize: 16,
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: "row", gap: layout.space[3] }}>
                        <View style={{ flex: 1 }}>
                            <Text variant="caption" style={{ color: colors.textMuted, marginBottom: layout.space[1] }}>
                                Preço
                            </Text>
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                placeholder="19,90"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="decimal-pad"
                                style={{
                                    height: 48,
                                    borderRadius: layout.radius.md,
                                    paddingHorizontal: layout.space[4],
                                    borderWidth: layout.borderWidth.hairline,
                                    borderColor: colors.border,
                                    backgroundColor: colors.surface2,
                                    color: colors.text,
                                    fontSize: 16,
                                }}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text variant="caption" style={{ color: colors.textMuted, marginBottom: layout.space[1] }}>
                                Estoque
                            </Text>
                            <TextInput
                                value={stock}
                                onChangeText={setStock}
                                placeholder="10"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="numeric"
                                style={{
                                    height: 48,
                                    borderRadius: layout.radius.md,
                                    paddingHorizontal: layout.space[4],
                                    borderWidth: layout.borderWidth.hairline,
                                    borderColor: colors.border,
                                    backgroundColor: colors.surface2,
                                    color: colors.text,
                                    fontSize: 16,
                                }}
                            />
                        </View>
                    </View>

                    <View>
                        <Text variant="caption" style={{ color: colors.textMuted, marginBottom: layout.space[1] }}>
                            Descrição (opcional)
                        </Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Detalhes do produto…"
                            placeholderTextColor={colors.textMuted}
                            multiline
                            style={{
                                minHeight: 96,
                                borderRadius: layout.radius.md,
                                paddingHorizontal: layout.space[4],
                                paddingVertical: layout.space[3],
                                borderWidth: layout.borderWidth.hairline,
                                borderColor: colors.border,
                                backgroundColor: colors.surface2,
                                color: colors.text,
                                fontSize: 16,
                                textAlignVertical: "top",
                            }}
                        />
                    </View>
                </View>

                {/* Actions */}
                <View style={{ marginTop: layout.space[6], gap: layout.space[3] }}>
                    <Button title={saving ? "Salvando…" : "Criar produto"} onPress={onCreate} disabled={!canSave || saving} />
                    <Button title="Cancelar" variant="secondary" onPress={() => router.back()} disabled={saving} />
                </View>
            </Screen>
        </SafeScreen>
    );
}
