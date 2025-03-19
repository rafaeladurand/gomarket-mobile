import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useCart } from "./cartContext";

const CartScreen = () => {
  const router = useRouter();
  const { cart, removeFromCart } = useCart();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#e0aa23" />
      <View style={styles.container}>
        <Text style={styles.title}>Carrinho de Compras</Text>
        {cart.length > 0 ? (
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
        )}
        <TouchableOpacity
          style={[styles.checkoutButton, cart.length === 0 && styles.disabled]}
          onPress={() => router.push("/confirmation")}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fef6e9",
  },
  container: {
    flex: 1,
    backgroundColor: "#fef6e9",
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#34A853",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#5D4037",
  },
  price: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#2E7D32",
  },
  removeButton: {
    backgroundColor: "#FF5722",
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#5D4037",
    fontWeight: "bold",
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: "#34A853",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,

  },
  checkoutText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFF",
    textTransform: "uppercase",
  },
  disabled: {
    backgroundColor: "#A5A5A5",
  },
});

export default CartScreen;
