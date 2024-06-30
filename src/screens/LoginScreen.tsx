import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Login'
>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '248209830274-gedhu45ofrunsqs5u774hgcoami5qckl.apps.googleusercontent.com',
        });
    }, []);

    const onGoogleButtonPress = async () => {
        try {
            // Récupérer l'identifiant et le jeton d'authentification de Google
            const { idToken } = await GoogleSignin.signIn();

            // Créer une crédential Firebase avec le jeton d'authentification Google
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Se connecter à Firebase avec les crédentials Google
            const userCredential = await auth().signInWithCredential(googleCredential);
            const { user } = userCredential;

            // Enregistrer les informations de l'utilisateur dans Firestore
            const userDoc = firestore().collection('users').doc(user.uid);
            await userDoc.set({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });

            console.log('Signed in with Google and user info saved to Firestore!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Se connecter avec Google"
                onPress={onGoogleButtonPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Fond clair
    },
});

export default LoginScreen;
