import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import httpService from "./services/httpService";

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      try {
        const response = await httpService.get(
          `http://192.168.1.22:3000/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: any) => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    const formData = new FormData();
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append("photo", blob, "profile.jpg");

    try {
      await httpService.post(
        `http://192.168.1.22:3000/api/users/${userId}/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    }
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    try {
      await httpService.put(
        `http://192.168.1.22:3000/api/users/${userId}`,
        { password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Senha atualizada com sucesso!");
      setPassword("");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={image ? { uri: image } : require("../assets/images/avatar.png")}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TextInput
        placeholder="Nova senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Atualizar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#388E3C",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
