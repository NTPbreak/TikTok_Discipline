
import React, { useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Vector from "react-native-vector-icons/MaterialCommunityIcons"
import Authentification from "./src/fronted/screen/auth";
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store, RootState } from './src/fronted/redux/store';
import { decrement, increment } from './src/fronted/redux/slices/counter';
import { useAppDispatch, useAppSelector } from './src/fronted/hooks/hooks';
import BottomSheet from "@gorhom/bottom-sheet"

import Auth from './src/fronted/screen/Account/account.js';
function PremierEcran() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>NTP Screen</Text>

    </View>
  );
}

const Account = () => {
  return (
    <Auth />
  );
}

function DetailsScreen() {

  const conteur = useAppSelector((state) => state.auth.value)
  const dispach = useAppDispatch()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>Notre variable est </Text>

      <View>
        <Text>{conteur}</Text>
      </View>
      <TouchableOpacity style={{ backgroundColor: "black", padding: 20, borderRadius: 20 }} onPress={() => dispach(increment())}>
        <Text style={{ color: "white" }}>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: "black", padding: 20, borderRadius: 20, marginTop: 30 }} onPress={() => dispach(decrement())}>
        <Text style={{ color: "white" }}>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (

    <Tab.Navigator screenOptions={{ headerShown: false }
  
  }
    >
      <Tab.Screen options={
        {
          tabBarIcon: ({ color, size }) => (
            <Vector name="home" color={color} size={size} />
          ),
        }
      } name="Home" component={PremierEcran} />
      <Tab.Screen name="Discipline"
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="av-timer" color={color} size={size} />
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
        component={Account} />

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