import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FriendsScreen from '../screens/FriendsScreen';
import InboxScreen from '../screens/InboxScreen';
import UploadScreen from '../screens/UploadScreen';
import TimeManager from '../screens/TimeManagerScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null; // Affiche un écran de chargement pendant l'initialisation

  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            case 'Message box':
              iconName = 'message-text';
              break;
            case 'timelapse':
              iconName = 'timelapse';
              break;
            case 'Add':
              iconName = 'plus-circle';
              break;
            default:
              iconName = 'help-circle';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown:false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Message box" component={FriendsScreen} />
      <Tab.Screen
        name="Add"
        component={UploadScreen}
        options={{ tabBarLabel: 'Add' }} // Optionnel: étiquette de tabulation
      />
      <Tab.Screen name="timelapse" component={TimeManager} />
      <Tab.Screen
        name="Profile"
        component={user ? ProfileScreen : LoginScreen}
      />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
