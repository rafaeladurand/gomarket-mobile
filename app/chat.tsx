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

const SERVER_URL = "http://192.168.137.1:3000";
const SOCKET_URL = "http://192.168.137.1:3000";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F3F3" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
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
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: "#F3F3F3",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffee",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 10,
  },
  messageTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#FA5A02",
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FA5A02",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
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
