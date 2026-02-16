import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

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

function formatInputNumber(n?: number) {
    if (typeof n !== "number") return "";
    // mostra com vírgula se tiver decimal
    const s = String(n);
    return s.includes(".") ? s.replace(".", ",") : s;
}

function parseNumberBR(input: string) {
    const cleaned = input.replace(/\s/g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
}

export default function ProductDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors, layout } = useTheme();

    const productId = useMemo(() => (typeof id === "string" ? id : ""), [id]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");

    const canSave = name.trim().length >= 2 && !loading;

    async function load() {
        if (!productId) return;

        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}/products/${productId}`);
            if (!res.ok) throw new Error(await res.text());

            const json: ApiResponse<ProductEntity> = await res.json();
            const p = json.data ?? (json as any);

            setName(p.name ?? "");
            setPrice(formatInputNumber(p.price));
            setStock(formatInputNumber(p.stock));
            setDescription(p.description ?? "");
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

            const res = await fetch(`${BASE_URL}/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Erro ao salvar");
            }

            Alert.alert("Salvo", "Produto atualizado com sucesso.");
        } catch (e: any) {
            Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
        } finally {
            setSaving(false);
        }
    }

    function onDelete() {
        Alert.alert(
            "Deletar produto",
            "Tem certeza? Essa ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setDeleting(true);

                            const res = await fetch(`${BASE_URL}/products/${productId}`, {
                                method: "DELETE",
                                headers: {
                                    // Authorization: `Bearer ${token}`,
                                },
                            });

                            if (!res.ok) {
                                const txt = await res.text();
                                throw new Error(txt || "Erro ao deletar");
                            }

                            Alert.alert("Ok", "Produto deletado.");
                            router.replace("/products");
                        } catch (e: any) {
                            Alert.alert("Erro", e?.message ?? "Não foi possível deletar.");
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    }

    return (
        <SafeScreen style={{ paddingTop: layout.space[5] }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ marginBottom: layout.space[5] }}>
                    <Text variant="heading">{loading ? "Carregando…" : "Editar produto"}</Text>
                    <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[1] }}>
                        ID: {productId}
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
                            placeholder="Nome do produto"
                            placeholderTextColor={colors.textMuted}
                            editable={!loading && !saving && !deleting}
                            style={{
                                height: 48,
                                borderRadius: layout.radius.md,
                                paddingHorizontal: layout.space[4],
                                borderWidth: layout.borderWidth.hairline,
                                borderColor: colors.borderStrong,
                                backgroundColor: colors.surface2,
                                color: colors.text,
                                fontSize: 16,
                                opacity: loading ? 0.6 : 1,
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
                                editable={!loading && !saving && !deleting}
                                style={{
                                    height: 48,
                                    borderRadius: layout.radius.md,
                                    paddingHorizontal: layout.space[4],
                                    borderWidth: layout.borderWidth.hairline,
                                    borderColor: colors.border,
                                    backgroundColor: colors.surface2,
                                    color: colors.text,
                                    fontSize: 16,
                                    opacity: loading ? 0.6 : 1,
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
                                editable={!loading && !saving && !deleting}
                                style={{
                                    height: 48,
                                    borderRadius: layout.radius.md,
                                    paddingHorizontal: layout.space[4],
                                    borderWidth: layout.borderWidth.hairline,
                                    borderColor: colors.border,
                                    backgroundColor: colors.surface2,
                                    color: colors.text,
                                    fontSize: 16,
                                    opacity: loading ? 0.6 : 1,
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
                            editable={!loading && !saving && !deleting}
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
                                opacity: loading ? 0.6 : 1,
                            }}
                        />
                    </View>
                </View>

                {/* Actions */}
                <View style={{ marginTop: layout.space[6], gap: layout.space[3] }}>
                    <Button title={saving ? "Salvando…" : "Salvar alterações"} onPress={onSave} disabled={!canSave || saving || deleting} />
                    <Button title={deleting ? "Deletando…" : "Deletar produto"} variant="secondary" onPress={onDelete} disabled={loading || saving || deleting} />
                    <Button title="Voltar" variant="ghost" onPress={() => router.back()} disabled={saving || deleting} />
                </View>

                {/* Placeholder imagens */}
                <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[6] }}>
                    Próximo: gerenciamento de imagens (upload / principal / reorder).
                </Text>
            </KeyboardAvoidingView>
        </SafeScreen>
    );
}
