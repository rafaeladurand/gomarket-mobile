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
import httpService from "./services/httpService";

const loadFonts = async () => {
  await Font.loadAsync({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });
};


const HomeScreen = () => {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<{ id: string; name: string; image: string; price: number; description: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; image: string; price: number; description: string }[]>([]);
  
  
  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: { id: string; name: string; image: string; price: number; description: string }[] = await httpService.get("http://192.168.1.22:3000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
  
    fetchProducts();
  }, []);

  
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]); 
  


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
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
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
