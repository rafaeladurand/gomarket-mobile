import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Baloon from "./balloon";
import httpService from "./services/httpService";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://192.168.1.9:3000";
const SOCKET_URL = "http://192.168.1.9:3000";

const ChatScreen = () => {
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  interface ChatMessage {
    content: string;
    sentBy: string;
  }
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        console.log("ID do usuário salvo:", userId);
  
        const user = await httpService.get(`${SERVER_URL}/api/users/${userId}`);
        console.log("Resposta da API (usuário):", user); 
  
        setUserName(user.name);
        console.log("Nome do usuário definido:", user.name);
         
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
  
    socket.on("connect", () => {
      console.log("Conectado ao servidor Socket.io");
  
      socket.emit("authenticate", userName);
    });
  
    socket.on("authenticated", (userData) => {
      console.log("Usuário autenticado:", userData);
      setUserName(userData.name); 
    });
  
    socket.on("chat message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
  
    socket.on("disconnect", () => {
      console.log("Desconectado do servidor Socket.io");
    });
  
    return () => {
      socket.disconnect();
    };
  }, [userName]); 
  
  

  useEffect(() => {
    if (userName && socket.current?.connected) {
      socket.current.emit("authenticate", userName);
    }
  }, [userName]);

  const sendMessage = () => {
    if (!content.trim()) return;

    const message = {
      content: content.trim(),
      sentBy: userName,
    };

    socket.current?.emit("chat message", message);
    setChatMessages((prev) => [...prev, message]);
    setContent("");
  };

  return (
    <Fragment>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {chatMessages.length > 0 ? (
          chatMessages.map((m, index) => (
            <Baloon key={index} message={m} currentUser={userName} />
          ))
        ) : (
          <Text style={styles.emptyMessageText}>Sem mensagens no momento</Text>
        )}
      </ScrollView>

      <SafeAreaView style={styles.messageTextInputContainer}>
        <TextInput
          style={styles.messageTextInput}
          placeholder="Digite sua mensagem"
          placeholderTextColor="#999"
          value={content}
          multiline
          onChangeText={setContent}
        />
        <TouchableOpacity
          style={styles.sendButton}
          disabled={!content.trim()}
          onPress={sendMessage}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 90,
  },
  emptyMessageText: {
    alignSelf: "center",
    color: "#848484",
    marginTop: 20,
    fontSize: 16,
  },
  messageTextInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5,
  },
  messageTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#FA5A02",
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default ChatScreen;
