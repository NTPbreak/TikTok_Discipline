import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Message, MessageProfil } from '../type';
import { useNavigation } from '@react-navigation/native'; // Pour la navigation
import { useRoute } from '@react-navigation/native'; // Pour accéder aux paramètres de la route

const MessageScreen: React.FC = () => {
  const navigation = useNavigation(); // Accéder à la navigation
  const route = useRoute(); // Accéder aux paramètres de la route

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<MessageProfil[]>([]);
  const userId = auth().currentUser?.uid || '';
  const destinataireId = route.params.idAbonne; // Récupérer le destinataire de la route

  const scrollViewRef = useRef<any>(null); // Réf pour la ScrollView

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('messages')
      .where('envoyeur', 'in', [userId, destinataireId])
      .where('destinataire', 'in', [userId, destinataireId])
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map(doc => doc.data() as MessageProfil);
        setMessages(messages);
        // Faites défiler vers le bas lorsque vous recevez un nouveau message
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });

    return () => unsubscribe(); // Se désinscrire de l'écouteur
  }, []);

  const sendMessage = async () => {
    const newMessage: Message = {
      message: messageText,
      date: new Date(),
    };

    const messageProfil: MessageProfil = {
      id: `${userId}-${destinataireId}`, // Vous pouvez générer un ID unique ici
      destinataire: destinataireId,
      envoyeur: userId,
      message: newMessage,
    };

    try {
      await firestore().collection('messages').doc().set(messageProfil);
      console.log('Message sent successfully!');
      setMessageText(''); // Efface le champ de texte après envoi
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessageItem = ({ item }: { item: MessageProfil }) => {
    const isMyMessage = item.envoyeur === userId;

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.messageRight : styles.messageLeft]}>
        <View style={styles.messageBubble}>
          <Text>{item.message.message}</Text>
        </View>
        <Text style={styles.messageTimestamp}>{(item.message.date?.getDate())}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        inverted={false} // Affiche les messages les plus récents en bas
        style={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 10,
    flex: 1,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageRight: {
    alignSelf: 'flex-end',
  },
  messageLeft: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    maxWidth: '80%',
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
});

export default MessageScreen;