import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useCart } from "./cartContext";

const loadFonts = async () => {
  await Font.loadAsync({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });
};

const products = [
  {
    id: "1",
    name: "Açúcar Refinado",
    price: 5.50,
    image: "https://zaffari.vtexassets.com/arquivos/ids/251448-800-auto?v=638560676658500000&width=800&height=auto&aspect=true",
    description: "Açúcar refinado de alta qualidade, ideal para adoçar bebidas e receitas. Pacote de 1kg.",
  },
  {
    id: "2",
    name: "Café Torrado e Moído",
    price: 18.90,
    image: "https://m.media-amazon.com/images/I/61SKJAAoLdL.AC_SX679.jpg",
    description: "Café torrado e moído de sabor intenso e aroma marcante. Pacote de 500g.",
  },
  {
    id: "3",
    name: "Sabão em Pó",
    price: 12.50,
    image: "https://m.media-amazon.com/images/I/613Rb20r1JL._AC_SX300_SY300_QL70_ML2.jpg",
    description: "Sabão em pó para roupas, limpa profundamente e mantém as cores vivas. Pacote de 1kg.",
  },
  {
    id: "4",
    name: "Detergente Líquido",
    price: 3.80,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRauK9NXyixQFjq4qSUU5bmbDUbemGVuM9Htg&s",
    description: "Detergente líquido concentrado para louças. Frasco de 500ml.",
  },
  {
    id: "5",
    name: "Desodorante Aerosol",
    price: 15.90,
    image: "https://m.media-amazon.com/images/I/41R-j+KqMGL.AC_SY300_SX300.jpg",
    description: "Desodorante aerosol de longa duração. Frasco de 150ml.",
  },
  {
    id: "6",
    name: "Shampoo",
    price: 22.00,
    image: "https://m.media-amazon.com/images/I/51ZYT46FUKL._AC_SX300_SY300_QL70_ML2.jpg",
    description: "Shampoo hidratante para cabelos sedosos e brilhantes. Frasco de 400ml.",
  },
  {
    id: "7",
    name: "Sabonete Líquido",
    price: 9.50,
    image: "https://d1qhsbqfqfzfzh.cloudfront.net/Custom/Content/Products/76/32/76328_primoderme-sabonete-liquido-200ml-p19580_z1_638349675535075154.jpg",
    description: "Sabonete líquido suave para limpeza e hidratação da pele. Frasco de 200ml.",
  },
  {
    id: "8",
    name: "Amaciante de Roupas",
    price: 14.90,
    image: "https://prezunic.vtexassets.com/arquivos/ids/187821-800-auto?v=638368828703230000&width=800&height=auto&aspect=true",
    description: "Amaciante de roupas para maciez e perfume duradouro. Frasco de 2L.",
  },
  {
    id: "9",
    name: "Farinha de Trigo",
    price: 6.00,
    image: "https://static.paodeacucar.com/img/uploads/1/411/579411.png",
    description: "Farinha de trigo refinada para pães e massas. Pacote de 1kg.",
  },
  {
    id: "10",
    name: "Biscoito Cream Cracker",
    price: 4.50,
    image: "https://www.padariavianney.com.br/web/image/product.product/26610/image_1024/%5B2215%5D%20Biscoito%20Cream%20Cracker%20Aymor%C3%A9%20200g?unique=307ed33",
    description: "Biscoito cream cracker crocante e leve. Pacote de 200g.",
  },
  {
    id: "11",
    name: "Manteiga com Sal",
    price: 10.90,
    image: "https://www.embare.com.br/wp-content/uploads/2023/08/manteiga-com-sal-200-camponesa-interna.png",
    description: "Manteiga com sal cremosa e saborosa. Pote de 200g.",
  },
  {
    id: "12",
    name: "Queijo Mussarela Fatiado",
    price: 16.50,
    image: "https://www.extrabom.com.br/uploads/produtos/350x350/162009_20220503111810_thumb_50440_removebg_preview.png",
    description: "Queijo mussarela fatiado, ideal para sanduíches e lanches. Pacote de 200g.",
  },
  {
    id: "13",
    name: "Suco de Laranja Integral",
    price: 8.90,
    image: "https://static.paodeacucar.com/img/uploads/1/324/666324.png",
    description: "Suco de laranja integral, sem conservantes. Garrafa de 1L.",
  },
  {
    id: "14",
    name: "Água Mineral com Gás",
    price: 2.50,
    image: "https://muffatosupermercados.vtexassets.com/arquivos/ids/368145-800-auto?v=638307503124200000&width=800&height=auto&aspect=true",
    description: "Água mineral com gás, pura e refrescante. Garrafa de 500ml.",
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);


  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);


  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
      
      <View style={styles.header}>
        <Image source={require("../assets/images/logo-gomarket.png")} style={styles.logo} />
        <Text style={styles.storeName}>GoMarket</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar produto"
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() =>
          router.push({ pathname: "/cart", params: { cart: JSON.stringify(cart) } })
        }
      >
        <Text style={styles.cartText}>Carrinho ({cart.length})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6e9",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 10,
  },
  storeName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF5722",
    fontFamily: "Poppins-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#34A853",
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    alignItems: "center",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    margin: 10,
    width: 150,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#34A853",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5D4037",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  price: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
  },
  cartButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  cartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "uppercase",
  },
});


export default HomeScreen;
