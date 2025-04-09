import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import httpService from "./services/httpService";

const SERVER_URL = "http://192.168.1.9:3000";

const ProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");

        if (!token || !userId) {
          Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
          router.replace("/login");
          return;
        }

        const res = await httpService.get(`${SERVER_URL}/api/users/${userId}`);
        setUser({ name: res.name, email: res.email });
      } catch (error) {
        console.log("Erro ao carregar dados do usuário:", error);
        Alert.alert("Erro", "Falha ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert("Você saiu da sua conta!");
    router.replace("/login");
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <LinearGradient
        colors={["#FBC02D", "#FA5A02", "#34A853"]}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#FA5A02" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FBC02D", "#FA5A02", "#34A853"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={80} color="#FA5A02" />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: "#34A853", marginBottom: 15 },
          ]}
          onPress={() => router.push("/editPassword")}
        >
          <Text style={styles.logoutText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#212121",
    marginTop: 15,
  },
  email: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#757575",
    marginBottom: 30,
  },
  logoutButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FA5A02",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#212121",
  },
});

export default ProfileScreen;
