import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import httpService from "./services/httpService";

const SERVER_URL = "http://192.168.1.9:3000";

const EditPassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As novas senhas não coincidem.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        router.replace("/login");
        return;
      }

      await httpService.put(`${SERVER_URL}/api/users/${userId}/password`, {
        currentPassword,
        newPassword,
      });

      Alert.alert("Sucesso", "Senha atualizada com sucesso.");
      router.back();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erro ao atualizar senha.";
      Alert.alert("Erro", errorMsg);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#FBC02D", "#FA5A02", "#34A853"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.card}
      >
        <Text style={styles.title}>Alterar Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Senha atual"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#212121",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: "Poppins-Regular",
  },
  button: {
    backgroundColor: "#FA5A02",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});

export default EditPassword;
