import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Video from 'react-native-video';
import Vector from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from '@react-native-firebase/firestore';
import { Video as VId, Comment, Profil, Abonnee } from "../type/index.ts";
import CommentModal from "./Modal.tsx";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';



const { width, height } = Dimensions.get('window');

interface VideoItemProps {
  id: string;
  videoUri: string;
  username: string;
  description: string;
  userUid: string;
  photo: string;
}

const VideoItem: React.FC<VideoItemProps> = ({ id, videoUri, username, description, userUid, photo }) => {
  const [Like, setLike] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [documentData, setDocumentData] = useState<VId | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeComment, setActiveComment] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = () => {
      const currentUser = auth().currentUser;
      setUser(currentUser);
    };
    fetchCurrentUser();
    fetchDocument();
    fetchComments();
    YouLike(); // Appel de la fonction au démarrage de l'application

  }, []);

  const fetchDocument = async () => {
    try {
      const documentSnapshot = await firestore().collection("upload").doc(id).get();
      if (documentSnapshot.exists) {
        setDocumentData(documentSnapshot.data() as VId);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
    }
  };

  const fetchComments = async () => {
    try {
      const documentSnapshot = await firestore().collection('upload').doc(id).get();
      if (documentSnapshot.exists) {
        const postData = documentSnapshot.data();
        if (postData && postData.comments) {
          setComments(postData.comments);
        }
      } else {
        console.log('Document not found');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addAbonnee = async (userU) => {
    const user = auth().currentUser;

    if (!user) {
      console.log('No user logged in');
      return;
    }

    try {
      const collection = firestore().collection("Abonnement");

      // Supposons que userUid soit un objet contenant les informations de l'utilisateur à suivre
      if (typeof userU !== 'string') {
        console.error('Invalid userUid : ', userUid);
        return;
      }

      const newAbonner = {
        suiveur: user.uid,
        suivie: userU,
        date: new Date(),
      };

      const querySnapshot = await collection
        .where('suiveur.id', '==', user.uid)
        .where('suivie.id', '==', userU)
        .get();

      if (!querySnapshot.empty || user.uid === userU) {
        console.log('Already subscribed to this user or cannot subscribe to yourself');
        return;
      }

      await collection.add(newAbonner);
      console.log('Abonnee added successfully!');
    } catch (error) {
      console.error('Error adding Abonnee: ', error);
    }
  };


  const YouLike = async () => {
    if (!documentData || !user) return;

    // Vérifier si l'utilisateur a déjà aimé la publication
    const presence = documentData.whyLove.find((element) => element === user.email);
    if (presence) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  const updateLikeStatus = async () => {
    if (!documentData || !user) return;

    let updatedLikes;
    if (Like) {
      // Remove user email from the whyLove array
      updatedLikes = documentData.whyLove.filter(email => email !== user.email);
    } else {
      // Add user email to the whyLove array
      updatedLikes = [...documentData.whyLove, user.email];
    }

    try {
      await firestore().collection("upload").doc(id).update({
        whyLove: updatedLikes
      });
      setLike(!Like);
      setDocumentData({ ...documentData, whyLove: updatedLikes });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="cover"
        paused={play}
        repeat={true}
      />
      {
        play ? (<TouchableOpacity style={{ position: "relative", bottom: "-40%", left: "40%" }} onPress={() => { setPlay(!play) }}>
          <Vector name='play-circle-outline' color={"white"} size={70} />
        </TouchableOpacity>) : (<TouchableOpacity style={{ position: "relative", bottom: "-40%", left: "40%" }} onPress={() => { setPlay(!play) }}>
          <Vector name='pause-circle-outline' color={"white"} size={70} />
        </TouchableOpacity>)
      }


      <View style={{ position: "absolute", left: "80%", bottom: "40%", display: "flex", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Image
            style={styles.avatar}
            source={{ uri: photo || 'https://via.placeholder.com/150' }}
          />
          <TouchableOpacity style={{ position: "relative", left: 19, top: -15, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FF2B54", borderRadius: 20, width: "50%" }}
            onPress={() => { addAbonnee(userUid) }}>
            <Vector name='plus' color={"white"} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={updateLikeStatus} style={{ marginTop: 15 }}>
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Vector name={Like ? 'heart' : 'heart-outline'} color={Like ? 'red' : 'white'} size={30} />
            <Text style={{ color: "white" }}>{documentData ? documentData.whyLove.length : 0}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 15 }}>
            <Vector name='comment-text-multiple' color={"white"} size={30} />
            <Text style={{ color: "white" }}>{comments.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.uiContainer}>
        <View style={styles.bottomContainer}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <CommentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        postId={id} // Passez l'ID du post comme prop
        username={user?.displayName}
        photo={user?.photoURL}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 10,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  uiContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    position: "absolute",
    top: -50
  },
  bottomContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 10,
  },

});

export default VideoItem;
