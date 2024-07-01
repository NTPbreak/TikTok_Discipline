import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Video from 'react-native-video';
import Vector from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Video as VId, Comment } from "../type/index.ts";
import { Modal } from 'react-native-paper';
import { User } from '@react-native-google-signin/google-signin';
import CommentModal from "./Modal.tsx";


const { width, height } = Dimensions.get('window');

interface VideoItemProps {
  id: string;
  videoUri: string;
  username: string;
  description: string;
  islove: boolean;
}

const VideoItem: React.FC<VideoItemProps> = ({ id, videoUri, username, description }) => {
  const [Like, setLike] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [documentData, setDocumentData] = useState<VId | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeComment, setActiveComment] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
        repeat
        paused={false}
      />
      <View style={{ position: "absolute", left: 340, bottom: 300 }}>
        <TouchableOpacity onPress={updateLikeStatus}>
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
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
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
