
import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Vector from "react-native-vector-icons/MaterialCommunityIcons"
import Authentification from "./src/fronted/screen/auth";
import { Provider,useSelector,useDispatch } from 'react-redux'
import { store } from './src/fronted/redux/store';

import { decrement,increment } from './src/fronted/redux/slices/authSlicer';

function PremierEcran() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>NTP Screen</Text>

    </View>
  );
}
function DetailsScreen() {


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>Notre variable est </Text>
    

    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (

    <Tab.Navigator screenOptions={{ headerShown: false }}
    >
      <Tab.Screen options={
        {
          tabBarIcon: ({ color, size }) => (
            <Vector name="home" color={color} size={size} />
          ),
        }
      } name="Home" component={PremierEcran} />
      <Tab.Screen name="Découvrir"
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="compass" color={color} size={size} />
            ),

          }
        }
        component={DetailsScreen} />
      <Tab.Screen name="Ajout"
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="plus" color={color} size={size} />
            ),

          }
        }
        component={DetailsScreen} />
      <Tab.Screen name="Boite de reception"
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="mail" color={color} size={size} />
            ),

          }
        }
        component={DetailsScreen} />
      <Tab.Screen name="Moi"
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="account" color={color} size={size} />
            ),

          }
        }
        component={DetailsScreen} />

    </Tab.Navigator >

  );
}

function App() {
  const [login, setLogin] = React.useState(true)
  return (


    <Provider store={store}>

      <NavigationContainer >
        <MyTabs />
      </NavigationContainer>
    </Provider>

  );

}
export default App;