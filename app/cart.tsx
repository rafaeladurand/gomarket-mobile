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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useCart } from "./cartContext";
import httpService from "./services/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const SERVER_URL = "http://192.168.1.22:3000";

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

  const handleCheckout = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const productIds = cart.map((item) => item._id);

      const json = {
        userId,
        productIds,
      };

      console.log("Dados do pedido:", json);
      const result = await httpService.post(
        `${SERVER_URL}/api/purchases/create`,
        json
      );
      console.log("📦 Resposta da API:", result);

      const purchaseId = result?.purchase?._id;

      if (!purchaseId) {
        throw new Error("ID do pedido não encontrado na resposta.");
      }

      await AsyncStorage.setItem("lastPurchaseId", purchaseId);
      clearCart();
      router.push("/payment");
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", "Não foi possível finalizar o pedido.");
    }
  };

  if (!fontsLoaded) return null;

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#e0aa23" />
      <View style={styles.container}>
        <Text style={styles.title}>Carrinho de Compras</Text>

        {cart.length > 0 ? (
          <FlatList
            data={cart}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item._id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="bag-outline"
              size={64}
              color="#A5A5A5"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
          </View>
        )}

        {cart.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: R$ {totalPrice.toFixed(2)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.checkoutButton, cart.length === 0 && styles.disabled]}
          onPress={handleCheckout}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyIcon: {
    marginBottom: 10,
  },
  totalContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 4,
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "#34A853",
  },
  totalText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#5D4037",
  },
});

export default CartScreen;
