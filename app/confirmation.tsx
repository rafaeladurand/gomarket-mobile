import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './cartContext'; 

const OrderConfirmationScreen = () => {
  const router = useRouter();
  const { clearCart } = useCart(); 


  const translateX = useRef(new Animated.Value(-100)).current; 

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 500, 
      duration: 2000, 
      useNativeDriver: true,
    }).start();
  }, [translateX]);

  const handleGoBackToProducts = () => {
    clearCart();
    router.push('/home'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fef6e9" />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color="#34A853" />
        </View>

        <Text style={styles.title}>Pedido Confirmado!</Text>
        <Text style={styles.message}>
          Seu pedido foi realizado com sucesso.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoBackToProducts}>
          <Text style={styles.buttonText}>Voltar para Produtos</Text>
        </TouchableOpacity>

        <View style={styles.cartContainer}>
          <Animated.View style={[styles.cartIcon, { transform: [{ translateX }] }]}>
            <Ionicons name="cart" size={40} color="#FF5722" />
          </Animated.View>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    backgroundColor: 'transparent',
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  message: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 30,
    lineHeight: 25,
  },
  button: {
    backgroundColor: "#34A853",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 8,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFF",
    textTransform: "uppercase",
  },
  cartContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cartIcon: {
    position: 'absolute',
    top: 40, 
  },
});

export default OrderConfirmationScreen;
