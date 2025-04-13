import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Baloon = ({ message, currentUser }: { message: any; currentUser: string }) => {
  if (!message) return null;

  const isSentByCurrentUser = currentUser === message.sentBy;
  const balloonColor = isSentByCurrentUser ? styles.balloonSent : styles.balloonReceived;
  const balloonTextColor = isSentByCurrentUser ? styles.balloonTextSent : styles.balloonTextReceived;
  const bubbleWrapperStyle = isSentByCurrentUser ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived;

  return (
    <View style={[styles.bubbleWrapper, bubbleWrapperStyle]}>
      {!isSentByCurrentUser && (
        <Text style={styles.senderName}>{message.sentBy}</Text>
      )}
      <View style={[styles.balloon, balloonColor]}>
        <Text style={[styles.balloonText, balloonTextColor]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: 'column',
    marginBottom: 8,
    maxWidth: '80%',
  },
  bubbleWrapperSent: {
    alignSelf: 'flex-end',
    marginLeft: 40,
  },
  bubbleWrapperReceived: {
    alignSelf: 'flex-start',
    marginRight: 40,
  },
  senderName: {
    marginBottom: 2,
    fontSize: 12,
    color: '#666',
  },
  balloon: {
    padding: 10,
    borderRadius: 16,
  },
  balloonSent: {
    backgroundColor: '#FA5A02',
  },
  balloonReceived: {
    backgroundColor: '#F0F0F0',
  },
  balloonText: {
    fontSize: 16,
  },
  balloonTextSent: {
    color: '#fff',
  },
  balloonTextReceived: {
    color: '#000',
  },
});

export default Baloon;
