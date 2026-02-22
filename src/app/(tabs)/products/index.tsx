import {
  FlatList,
  RefreshControl,
  View
} from "react-native";

import Button from "@/src/components/button";
import Header from "@/src/components/header";
import Loading from "@/src/components/loading";
import { ProductItem } from "@/src/components/productsItens";
import { SafeScreen } from "@/src/components/safeAreaScreen";
import { ScreenList } from "@/src/components/screenList";
import SearchBar from "@/src/components/searchBar";
import Text from "@/src/components/text";
import { useTheme } from "@/src/contexts/theme/useTheme";
import { useRouter } from "expo-router";
import useProductsModel from "./models/products.model";

export default function Products() {
  const {search, setSearch, items, loading, refreshing, loadingMore, meta, onEndReached, onRefresh} = useProductsModel();
  const { colors, layout } = useTheme();
  const router = useRouter();
  return (
    <SafeScreen>
      <ScreenList >
      <Header title={'Produtos'} footer={'Gerencie o seu catálogo'}/>
      <SearchBar value={search} placeholder="Buscar produto..." onChangeText={setSearch}/>

      <Button style={{ marginBottom: layout.space[4] }} title="Novo produto" onPress={() => router.push("/products/new")} />

      {loading ? (
        <Loading text="Carregando produtos..."/>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductItem item={item} />}
          onEndReachedThreshold={0.6}
          onEndReached={onEndReached}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={{ paddingTop: layout.space[6], alignItems: "center" }}>
              <Text variant="bodyStrong">Nada aqui ainda</Text>
              <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[2] }}>
                Crie seu primeiro produto 👀
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <Loading text="Carregando mais produtos..." />
            ) : null
          }
        />
      )}
    </ScreenList>
    </SafeScreen>
  );
}
