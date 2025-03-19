import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  interface Errors {
    name?: string;
    email?: string;
    cpf?: string;
    password?: string;
    confirmPassword?: string;
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
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validateCPF = (cpf: string) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
  };

  const handleRegister = () => {
    let newErrors: Errors = {};

    if (name.trim().length < 2) {
      newErrors.name = "O nome deve ter pelo menos 2 caracteres";
    }
    if (!validateEmail(email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!validateCPF(cpf)) {
      newErrors.cpf = "CPF inválido (use o formato 000.000.000-00)";
    }
    if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    Alert.alert("Sucesso", "Conta criada com sucesso!");
    router.push("/login");
  };

  return (
    <LinearGradient
      colors={["#FBC02D", "#FA5A02", "#34A853"]}
      style={styles.container}
    >
      
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#212121"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor="#757575"
            value={name}
            onChangeText={setName}
          />
        </View>
       
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#212121"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#757575"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        {errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}
        <View style={styles.inputContainer}>
          <Ionicons
            name="id-card-outline"
            size={20}
            color="#212121"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor="#757575"
            value={cpf}
            onChangeText={setCpf}
          />
        </View>
       
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#212121"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#757575"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        
        {errors.confirmPassword && (<Text style={styles.error}>{errors.confirmPassword}</Text>)}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#212121"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Repetir Senha"
            placeholderTextColor="#757575"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Já tem uma conta? Entrar</Text>
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
    color: "#212121",
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
  },
});

export default RegisterScreen;
