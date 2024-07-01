import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from "react";
import { Profil } from "../type";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Vector from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from '@react-native-firebase/firestore';
import MessageScreen from '../components/Message';
import { useNavigation } from '@react-navigation/native';

const getUserById = async (userId: string): Promise<Profil | null> => {
  try {
    const documentSnapshot = await firestore().collection('users').doc(userId).get();
    if (documentSnapshot.exists) {
      const userData = documentSnapshot.data() as Profil;
      return userData;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

const FriendsScreen: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [abonne, setAbonne] = useState<Profil[]>([]);
  const [activeMessage, setMessage] = useState(false);
  const [idAbonne, setIdAbonne] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const fetchCurrentUser = () => {
      const currentUser = auth().currentUser;
      setUser(currentUser);
      if (currentUser) {
        getAbonnees(currentUser.uid);
      }
    };
    fetchCurrentUser();
  }, []);

  const getAbonnees = async (userId: string) => {
    try {
      const snapshot = await firestore()
        .collection('Abonnement')
        .where('suivie', '==', userId)
        .get();

      if (!snapshot.empty) {
        const abonneePromises = snapshot.docs.map(async (doc) => {
          const abonneeData = doc.data() as { suiveur: string };
          const userProfil = await getUserById(abonneeData.suiveur);
          return userProfil;
        });

        const abonnees = (await Promise.all(abonneePromises)).filter(Boolean) as Profil[];
        setAbonne(abonnees);
      } else {
        console.log('No abonnees found');
      }
    } catch (error) {
      console.error('Error getting abonnees: ', error);
    }
  };


  const renderAbonnee = ({ item }: { item: Profil }) => (
    <View style={styles.abonneeItem}>
      <TouchableOpacity onPress={() => {
        setIdAbonne(item.uid);
        navigation.navigate('Message', { idAbonne: item.uid });
      }}>

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Image
            style={styles.avatar}
            source={{ uri: item.photoURL || 'https://via.placeholder.com/150' }}
          />
          <Text style={styles.abonneeText}>{item.displayName}</Text>
        </View>

      </TouchableOpacity>

    </View>
  );


  return (
    (
      <View style={styles.container}>
        <View style={styles.send}>
          <Vector name='send' size={20} color={"black"} />
          <View style={[styles.badge, { justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ color: "white" }}>0</Text>
          </View>
        </View>

        <Text style={styles.title}>Liste d'amis</Text>
        {
          abonne.length > 0 ? (
            <FlatList
              data={abonne}
              keyExtractor={(item) => item.uid}
              renderItem={renderAbonnee}
              style={{ flex: 1, marginTop: "20%" }}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>Aucun amis</Text>
            </View>
          )
        }

      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  send: {
    position: "absolute",
    top: "3%",
    left: "90%"
  },
  badge: {
    backgroundColor: "#FF2B54",
    borderRadius: 40,
    padding: "1%"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: "20%"
  },
  abonneeItem: {
    padding: "1%",
    borderBottomColor: '#ccc',
  },
  abonneeText: {
    fontSize: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: 10,
    marginRight: "5%"
  },
});

export default FriendsScreen;
