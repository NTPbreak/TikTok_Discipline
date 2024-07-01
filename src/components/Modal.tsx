import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import { BottomSheet, ListItem } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { Comment, Video } from '../type'; // Assurez-vous d'importer le type Comment correctement
import Vector from "react-native-vector-icons/MaterialCommunityIcons";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    postId: string; // ID du post pour lequel les commentaires sont affichés
    username: string; // Nom de l'utilisateur pour affichage
}

const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose, postId, username }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);



    useEffect(() => {
        const fetchCurrentUser = () => {
            const currentUser = auth().currentUser;
            setUser(currentUser);
        };
        fetchCurrentUser();
        fetchComments();
    }, [comments]);

    // Fonction pour charger les commentaires depuis Firestore
    const fetchComments = async () => {
        try {
            const documentSnapshot = await firestore().collection('upload').doc(postId).get();
            if (documentSnapshot.exists) {
                const postData = documentSnapshot.data() as Video;
                if (postData && postData.comments) {
                    setComments(postData.comments) ;
                }
            } else {
                console.log('Document not found');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Fonction pour ajouter un nouveau commentaire à Firestore
    const addComment = async () => {
        if (!newComment.trim()) return;

        const commentToAdd: Comment = {
            comment: newComment,
            name: username,
            photo:user?.photoURL
            // Ajoutez ici d'autres champs comme la date, etc. selon votre modèle de données
        }

        try {
            const updatedComments = [...comments, commentToAdd];
            await firestore().collection('upload').doc(postId).update({
                comments: updatedComments,
            });
            setComments(updatedComments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Liste des commentaires à afficher dans le BottomSheet
    const renderCommentsList = () => {
        return (
            <>
                {comments.map((comment, index) => (
                    <ListItem key={index} bottomDivider>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: comment.photo || 'https://via.placeholder.com/150' }}
                            />
                            <ListItem.Content>
                                <ListItem.Title>{comment.name}</ListItem.Title>
                                <ListItem.Subtitle>{comment.comment}</ListItem.Subtitle>
                            </ListItem.Content>
                        </View>

                    </ListItem>
                ))}
            </>
        );
    };

    return (
        <BottomSheet isVisible={visible} containerStyle={styles.bottomSheetContainer}>

            <View style={styles.bottomSheetInnerContainer}>
                <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }} onPress={onClose}>
                    <Vector name='close' color={"black"} size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>Comments</Text>
                <ScrollView style={styles.commentsContainer}>
                    {renderCommentsList()}
                </ScrollView>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        numberOfLines={3}
                    />
                    <TouchableOpacity style={[styles.button, { display: "flex", alignItems: "center", justifyContent: "center" }]} onPress={addComment}>
                        <Vector name='send' color={"#FF2B54"} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomSheetInnerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        flex: 1,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentsContainer: {
        maxHeight: 350,
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginBottom: 10,
        marginRight: 10
    },
});

export default CommentModal;
