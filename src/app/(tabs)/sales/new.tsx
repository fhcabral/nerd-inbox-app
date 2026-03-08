import { View } from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { Screen } from "@/src/components/screen";
import Text from "@/src/components/text";
import TextArea from "@/src/components/textArea";
import TextInputComponent from "@/src/components/textInput";
import useNewSalesModel from "./models/new-sales.model";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function NewSale() {
 const model = useNewSalesModel();

  return (
    <SafeScreen style={{ paddingTop: model.layout.space[5] }}>
      <Screen>
        <Header title="Nova venda" footer="Crie a venda e depois adicione os produtos" />

        <View style={{ gap: model.layout.space[2] }}>
          <TextInputComponent
            label="Nome do cliente (opcional)"
            value={model.customerName}
            onChangeText={model.setCustomerName}
            placeholder="Ex: Cliente balcão"
          />

          <TextInputComponent
            label="CPF do cliente (opcional)"
            value={model.customerCpf}
            onChangeText={(v) => model.setCustomerCpf(onlyDigits(v))}
            placeholder="Somente números"
            inputStyle={{ letterSpacing: 0.6 }}
          />

          <TextArea
            description={model.notes}
            setDescription={model.setNotes}
            placeholder="Observações… (opcional)"
          />
        </View>

        <View style={{ marginTop: model.layout.space[6], gap: model.layout.space[3] }}>
          <Button title={model.saving ? "Criando…" : "Criar venda"} onPress={model.onCreate} disabled={!model.canCreate} />
          <Button title="Voltar" variant="ghost" onPress={() => model.router.back()} disabled={model.saving} />
        </View>

        <Text variant="caption" style={{ color: model.colors.textMuted, marginTop: model.layout.space[6] }}>
          Dica: você pode criar a venda sem cliente e preencher depois no caixa.
        </Text>
      </Screen>
    </SafeScreen>
  );
}