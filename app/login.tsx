import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import httpService from "./services/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const SERVER_URL = "http://192.168.1.22:3000";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
  
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
  
      if (token && userId) {
        try {
          const res = await httpService.get(`${SERVER_URL}/api/users/${userId}`);
          const userName = res?.name || "usuário";
          console.log("Usuário autenticado automaticamente:", res);
          Alert.alert("Login realizado", `Bem-vindo de volta, ${userName}!`);
          router.replace("/home");
        } catch (err) {
          console.log("Erro ao buscar usuário logado:", err);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    checkLoginStatus();
  }, []);

  const sendLogin = async () => {
    const json = { email, password };
  
    try {
      const result = await httpService.post(`${SERVER_URL}/api/users/login`, json);
  
      if (result.user && result.user.id) {
        await AsyncStorage.setItem("token", result.token);
        await AsyncStorage.setItem("userId", result.user.id);
  
        console.log("🟢 Login realizado com sucesso!");
        console.log("👤 Usuário:");
        console.table({
          ID: result.user.id,
          Nome: result.user.name,
          Email: result.user.email,
        });
        console.log("🔐 Token:");
        console.log(result.token);
        console.log("========================================");

        Alert.alert("Login realizado", `Bem-vindo, ${result.user.name}!`);
        return true;
      } else {
        Alert.alert("Erro", "Usuário ou ID inválido na resposta.");
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Erro", error.response.data.message);
      } else {
        Alert.alert("Erro", "Falha ao fazer login.");
      }
      return false;
    }
  };

  interface Errors {
    email?: string;
    password?: string;
  }

  const [errors, setErrors] = useState<Errors>({});

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    let newErrors: Errors = {};

    if (!validateEmail(email)) {
      newErrors.email = "E-mail inválido";
    }

    if (password.length < 6) {
      newErrors.password = "Insira a senha";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await sendLogin();
    if (success) {
      router.push("/home");
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#FBC02D", "#FA5A02", "#34A853"]}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#FA5A02" />
          <Text style={styles.loadingText}>Verificando login...</Text>
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
        <Text style={styles.title}>Login</Text>
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#212121" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#757575"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#212121" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#757575"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Criar uma conta</Text>
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
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#212121",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F5F5F5",
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins-Regular",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FA5A02",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  link: {
    marginTop: 15,
    color: "#FA5A02",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  error: {
    color: "red",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
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

export default LoginScreen;
