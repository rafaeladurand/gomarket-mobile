import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { CartProvider, useCart } from "./cartContext";
import HomeScreen from "./home";
import CartScreen from "./cart";
import ConfirmationScreen from "./confirmation";
import LoginScreen from "./login";
import RegisterScreen from "./register";
import SplashScreen from "./splash";
import { Ionicons } from "@expo/vector-icons";
import PaymentScreen from "./payment";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { cart } = useCart();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 60,
          borderRadius: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10,
          justifyContent: "center",
          paddingTop: 5,
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          transform: [{ scale: 1 }],
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Carrinho"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
          tabBarBadge: cart.length > 0 ? cart.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#FF5722", 
            color: "#fff", 
            fontSize: 12,
            width: 20, 
            height: 20, 
            borderRadius: 10, 
            justifyContent: "center", 
            alignItems: "center", 
            fontWeight: "bold",
            position: "absolute", 
            top: -10,
            right: -15,
          },
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="home" component={TabNavigator} />
      <Stack.Screen name="confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="cart" component={CartScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="payment" component={PaymentScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default function RootLayout() {
  return (
    <CartProvider>
      <StackNavigator />
    </CartProvider>
  );
}
