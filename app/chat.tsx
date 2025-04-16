// ChatScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Baloon from "./balloon";
import httpService from "./services/httpService";
import { io, Socket } from "socket.io-client";
import { Alert } from "react-native";

const SERVER_URL = "http://192.168.1.18:3000";
const SOCKET_URL = "http://192.168.1.18:3000";

interface ChatMessage {
  id: string;
  content: string;
  sentBy: string;
  timestamp?: string;
}

const ChatScreen = () => {
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typingStatus, setTypingStatus] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const socket = useRef<Socket | null>(null);

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

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    socket.current = newSocket;

    newSocket.on("connect", () => {
      newSocket.emit("authenticate", userName);
    });

    newSocket.on("authenticated", (userData) => {
      setUserName(userData.name);
    });

    newSocket.on("chat message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    newSocket.on("edit message", (updatedMsg: ChatMessage) => {
      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
      );
    });

    newSocket.on("delete message", (messageId: string) => {
      setChatMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    newSocket.on("user typing", (name: string) => {
      if (name !== userName) {
        setTypingStatus(`${name} está digitando...`);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingStatus(""), 3000);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userName]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!content.trim()) return;

    const message = {
      content: content.trim(),
      sentBy: userName,
      timestamp: new Date().toISOString(),
    };

    socket.current?.emit("chat message", message);
    setContent("");
  };

  const handleEdit = (message: ChatMessage) => {
    Alert.prompt(
      "Editar mensagem",
      "Altere o conteúdo da mensagem:",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Salvar",
          onPress: (newContent) => {
            if (newContent && newContent.trim()) {
              socket.current?.emit("edit message", {
                ...message,
                content: newContent.trim(),
              });
            }
          },
        },
      ],
      "plain-text",
      message.content
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert("Excluir mensagem", "Tem certeza que deseja excluir esta mensagem?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => socket.current?.emit("delete message", id) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff7ec" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Chat</Text>
            <ScrollView
              contentContainerStyle={styles.scrollViewContainer}
              ref={scrollViewRef}
              keyboardShouldPersistTaps="handled"
            >
              {typingStatus !== "" && (
                <Text style={styles.typingStatus}>{typingStatus}</Text>
              )}
              {chatMessages.length > 0 ? (
                chatMessages.map((m, index) => (
                  <Baloon
                    key={index}
                    message={m}
                    currentUser={userName}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <Text style={styles.emptyMessageText}>Sem mensagens no momento</Text>
              )}
            </ScrollView>

            <View style={styles.messageTextInputContainer}>
              <TextInput
                style={styles.messageTextInput}
                placeholder="Digite sua mensagem"
                placeholderTextColor="#999"
                value={content}
                multiline
                onChangeText={(text) => {
                  setContent(text);
                  socket.current?.emit("typing", userName);
                }}
              />
              <TouchableOpacity
                style={styles.sendButton}
                disabled={!content.trim()}
                onPress={sendMessage}
              >
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#fff7ec",
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#FA5A02", 
    textAlign: 'center',
    marginTop: 65,
    fontFamily: "Poppins-Regular",
  },
  typingStatus: {
    fontStyle: "italic",
    color: "#666",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: "Poppins-Regular",
  },
  emptyMessageText: {
    alignSelf: "center",
    color: "#aaa",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginTop: 20,
  },
  messageTextInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTextInput: {
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
  sendButton: {
    backgroundColor: "#FA5A02",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButtonCancel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 8,
  },
  modalButtonSave: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FA5A02",
    padding: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontFamily: "Poppins-Bold",
  },
});

export default ChatScreen;
