import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

const Baloon = ({
  message,
  currentUser,
  onEdit,
  onDelete,
}: {
  message: any;
  currentUser: string;
  onEdit: (message: any) => void;
  onDelete: (id: string) => void;
}) => {
  if (!message) return null;

  const isSentByCurrentUser = currentUser === message.sentBy;
  const bubbleStyles = isSentByCurrentUser ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived;
  const balloonColor = isSentByCurrentUser ? styles.balloonSent : styles.balloonReceived;
  const balloonTextColor = isSentByCurrentUser ? styles.balloonTextSent : styles.balloonTextReceived;

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleLongPress = () => {
    if (isSentByCurrentUser) {
      Alert.alert("Mensagem", "O que deseja fazer?", [
        { text: "Editar", onPress: () => onEdit(message) },
        { text: "Excluir", onPress: () => onDelete(message.id), style: "destructive" },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress}>
      <View style={[styles.bubbleWrapper, bubbleStyles]}>
        <Text style={[styles.senderName, isSentByCurrentUser && styles.senderNameCurrentUser]}>
          {message.sentBy}
        </Text>
        <View style={[styles.balloon, balloonColor]}>
          <Text style={[styles.balloonText, balloonTextColor]}>{message.content}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: "column",
    marginBottom: 10,
    maxWidth: "80%",
  },
  bubbleWrapperSent: {
    alignSelf: "flex-end",
    marginLeft: 40,
    marginRight: 8,
  },
  bubbleWrapperReceived: {
    alignSelf: "flex-start",
    marginRight: 40,
    marginLeft: 8,
  },
  senderName: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
    fontFamily: "Poppins-Medium",
  },
  senderNameCurrentUser: {
    color: "#FA5A02",
    fontFamily: "Poppins-Bold",
  },
  balloon: {
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    maxWidth: "100%",
    position: "relative",
  },
  balloonSent: {
    backgroundColor: "#FA5A02",
  },
  balloonReceived: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  balloonTextSent: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
  balloonTextReceived: {
    color: "#333",
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
  timestamp: {
    fontSize: 10,
    color: "#bbb",
    marginTop: 6,
    textAlign: "right",
    fontFamily: "Poppins-Regular",
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "flex-end",
  },
  icon: {
    marginLeft: 10,
  },
  balloonText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
});

export default Baloon;
