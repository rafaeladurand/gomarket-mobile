import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatFAQScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 FAQ - Perguntas Frequentes</Text>
      <Text style={styles.text}>
        Aqui você poderá ver as perguntas mais comuns dos usuários sobre o GoMarket.
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

export default ChatFAQScreen;
