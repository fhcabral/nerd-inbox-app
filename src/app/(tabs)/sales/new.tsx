import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import TextArea from "@/src/components/textArea";
import TextInputComponent from "@/src/components/textInput";
import { useTheme } from "@/src/contexts/theme/useTheme";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function NewSale() {
  const router = useRouter();
  const { colors, layout } = useTheme();

  const [saving, setSaving] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");
  const [notes, setNotes] = useState("");

  const canCreate = !saving;

  async function onCreate() {
    try {
      setSaving(true);

      // TODO: chamar POST /sales com CreateSaleDto
      // const res = await api.post("/sales", { customerName, customerCpf, notes })
      // const saleId = res.data.data.id

      const saleId = "TEMP_ID";

      Alert.alert("Criada", "Venda criada. Agora adicione itens.");
      router.push({ pathname: "/sales/[id]", params: { id: saleId } });
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível criar a venda.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeScreen style={{ paddingTop: layout.space[5] }}>
      <Screen>
        <Header title="Nova venda" footer="Crie a venda e depois adicione os produtos" />

        <View style={{ gap: layout.space[2] }}>
          <TextInputComponent
            label="Nome do cliente (opcional)"
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Ex: Cliente balcão"
          />

          <TextInputComponent
            label="CPF do cliente (opcional)"
            value={customerCpf}
            onChangeText={(v) => setCustomerCpf(onlyDigits(v))}
            placeholder="Somente números"
            inputStyle={{ letterSpacing: 0.6 }}
          />

          <TextArea
            description={notes}
            setDescription={setNotes}
            placeholder="Observações… (opcional)"
          />
        </View>

        <View style={{ marginTop: layout.space[6], gap: layout.space[3] }}>
          <Button title={saving ? "Criando…" : "Criar venda"} onPress={onCreate} disabled={!canCreate} />
          <Button title="Voltar" variant="ghost" onPress={() => router.back()} disabled={saving} />
        </View>

        <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[6] }}>
          Dica: você pode criar a venda sem cliente e preencher depois no caixa.
        </Text>
      </Screen>
    </SafeScreen>
  );
}