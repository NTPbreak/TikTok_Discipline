import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UploadScreen: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);

  const selectVideo = () => {
    launchImageLibrary({ mediaType: 'video' }, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('Utilisateur a annulé la sélection de la vidéo');
      } else if (response.errorMessage) {
        console.log('Erreur de sélection d\'image: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const { uri } = response.assets[0];
        if (uri) {
          uploadVideo(uri);
        } else {
          console.error('Erreur: URI de la vidéo est indéfinie.');
        }
      }
    });
  };

  const uploadVideo = async (uri: string) => {
    setUploading(true);
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = uri.replace('file://', '');

    const task = storage().ref(filename).putFile(uploadUri);

    task.on('state_changed', snapshot => {
      console.log(snapshot);
    });

    try {
      await task;

      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;

        const downloadURL = await storage().ref(filename).getDownloadURL();
        await firestore().collection('upload').add({
          userId,
          videoUrl: downloadURL,
          username: user.displayName,
          description: 'Ajouter une description', // Vous pouvez modifier cela pour obtenir la description de l'utilisateur
          timestamp: new Date(),
        });

        Alert.alert('Vidéo uploadée !', 'Votre vidéo a été uploadée avec succès.');
      } else {
        console.error('Erreur: l\'utilisateur n\'est pas authentifié.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de la vidéo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'upload de la vidéo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Sélectionner et uploader une vidéo" onPress={selectVideo} disabled={uploading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UploadScreen;
