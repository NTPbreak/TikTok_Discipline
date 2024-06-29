
import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Vector from "react-native-vector-icons/MaterialCommunityIcons"
import { Provider } from 'react-redux';
import Authentification from "./src/fronted/screen/auth";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { store } from './src/fronted/redux/store.ts';

const PremierEcran = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      NTP Screen
    </View>
  )
}

const DetailsScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      Details Screen
      Notre variable est
    </View>
  )
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  const navigation = useNavigation();
  // ... other code ...

  // Animated styles for tab bar
  const selectedTab = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = withTiming(selectedTab.value * 60, { duration: 200 });
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Hide text labels
        tabBarStyle: {
          backgroundColor: '#141414', // Black background
          height: 70, // Adjust as needed
          position: 'absolute',
          bottom: 20,
          left: 20, // Add padding to avoid overlapping with edges
          right: 20, // Add padding to avoid overlapping with edges
          borderRadius: 30, // Rounded corners
          paddingHorizontal: 20, // Add padding
          elevation: 0, // Remove shadow
          shadowOpacity: 0,
          padding: 20
        },
        tabBarActiveTintColor: '#fff', // White active icon color
        tabBarInactiveTintColor: '#888', // Gray inactive icon color

      }}
    >
      {/* ... your tabs  */}

      {/* Add the onTabPress event to update the selectedTab value */}
      <Tab.Screen
        name="Home"
        component={PremierEcran}
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="home-outline" color={color} size={size} />
            ),

          }
        }
      />

      {/* ... your other tabs, update the selectedTab.value accordingly  */}
      <Tab.Screen
        name="Découvrir"
        component={DetailsScreen}
        options={
          {
            tabBarIcon: ({ color, size }) => (
              <Vector name="compass-outline" color={color} size={size} />
            ),

          }
        }
      />

      {/* ... your other tabs, update the selectedTab.value accordingly  */}

    </Tab.Navigator>
  );
}

// ... your other code ...

function App() {
  const [login, setLogin] = React.useState(true)
  return (

    <Provider store={store}>
      <NavigationContainer   >
        <MyTabs />
      </NavigationContainer>
    </Provider>

  );

}
export default App;