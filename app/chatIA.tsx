import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatIaScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Chat com IA</Text>
      <Text style={styles.text}>
        Este é o espaço para você conversar com nossa inteligência artificial e tirar dúvidas!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6e9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default ChatIaScreen;
