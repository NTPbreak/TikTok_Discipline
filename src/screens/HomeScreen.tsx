import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, SafeAreaView,Text } from 'react-native';
import VideoItem from '../components/VideoItem';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';

const { height } = Dimensions.get('window');

interface Video {
  id: string;
  videoUrl: string;
  username: string;
  description: string;
  userId: string;
  islove: boolean;
  numComment: number;
  numLike: number;
  whyLove: string[]
}

const HomeScreen: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLike, setIsLike] = useState(false);
  const [numLike, setNumLike] = useState(0);
  const [numComment, setNumComment] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Récupération initiale des vidéos depuis Firestore...');
        const videosSnapshot = await firestore().collection('upload').get();
        const fetchedVideos: Video[] = videosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];
        console.log('Vidéos récupérées:', fetchedVideos);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
      }
    };

    const unsubscribe = firestore().collection('upload').onSnapshot(snapshot => {
      console.log('Mise à jour en temps réel des vidéos depuis Firestore...');
      const updatedVideos: Video[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Video[];
      setVideos(updatedVideos);
    });

    fetchVideos();

    // Clean up listener
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: Video }) => {
    console.log('Affichage de la vidéo:', item);
    return (
      <VideoItem
        id = {item.id}
        videoUri={item.videoUrl}
        username={item.username}
        description={item.description}
        userId={item.userId}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
          data={videos}
          renderItem={ renderItem}
          keyExtractor={item => item.id}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          pagingEnabled
          showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  );
};

export default HomeScreen;
