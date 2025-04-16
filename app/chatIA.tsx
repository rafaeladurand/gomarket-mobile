import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import httpService from "./services/httpService";

const ChatIaScreen = () => {
  const SERVER_URL = "http://192.168.1.18:3000";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

    const [fontsLoaded] = useFonts({
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const user = await httpService.get(`${SERVER_URL}/api/users/${userId}`);
        setUserName(user.name);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: { from: "user" | "bot"; text: string } = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await httpService.post(`${SERVER_URL}/api/ai/long-context`, {
        prompt: input,
        user: userName,
      });

      const botMessage: { from: "user" | "bot"; text: string } = { from: "bot", text: String(response) };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Ocorreu um erro ao se comunicar com a IA." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: { from: "user" | "bot"; text: string } }) => (
    <View
      style={[
        styles.messageContainer,
        item.from === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff7ec" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Chat com Gabi</Text>
          {userName !== "" && (
            <Text style={styles.subtitle}>
              Bem-vindo, {userName.split(" ")[0]}!
            </Text>
          )}
  
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
  
          {loading && <ActivityIndicator size="small" color="#388E3C" />}
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua pergunta"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={sendMessage}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};  

export default ChatIaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#fff7ec",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "Poppins-Regular",
  },
  subtitle: {
    alignSelf: "center",
    color: "#aaa",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginTop: 20,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: "#c8fdd8",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  botMessage: {
    backgroundColor: "#e6e6e6",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
