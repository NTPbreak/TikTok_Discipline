import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from "react-native-paper";
import Vector from "react-native-vector-icons/MaterialCommunityIcons"
import styles from './style';

const ModifyInformation = () => {

}

const ProfilePage = () => {
  const [username, setUsername] = useState('username');
  const [bio, setBio] = useState('Bio de l\'utilisateur');
  const [profilePicture, setProfilePicture] = useState(
    'https://via.placeholder.com/150'
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Enregistre les informations modifiées (simule un appel API)
    console.log(`Nom d\'utilisateur: ${username}`);
    console.log(`Bio: ${bio}`);
    console.log(`Image de profil: ${profilePicture}`);
    setIsEditing(false);
  };

  
const LoginScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Mot de passe" />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
};

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.profilePage}>
      <View style={styles.profileHeader}>
        <Vector name='account-circle' color={"gray"} size={100} />
        {/* <View><Button><Text>Modifier  </Text><Vector name='pencil' size={20} /></Button></View> */}
        <Text style={{ fontWeight: "bold", color: "black" }}>@Nom utilisateur</Text>
      </View>

      <View style={{flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "black" }}>0</Text>
          <Text>Abonnement</Text>
        </View>
        <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "black" }}>0</Text>
          <Text>Abonné</Text>
        </View>

        <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "black" }}>0</Text>
          <Text>J'aime</Text>
        </View>
      </View>

      <View style={{flex:1,marginTop:100,justifyContent:"center"}}>
          <Text style={{fontWeight:"bold",fontSize:20,marginBottom:20}}>Retrouve les videos que tu as aimées</Text>
          <Button style={{backgroundColor:"#FF2B54",borderRadius:0,width:300,fontWeight:"bold",fontSize:20}}><Text style={{color:"white"}}>Inscription</Text></Button>
      </View>
    </View>
  );
};


export default ProfilePage;