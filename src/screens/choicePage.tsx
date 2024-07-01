import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MessageScreen from "../components/Message.tsx";
import FriendsScreen from "./FriendsScreen.tsx";

const stack = createStackNavigator();

const ChoicePage = () => {
    return (
        <stack.Navigator>
            <stack.Screen name="ListFriend" options={{headerShown:false}} component={FriendsScreen} />
            <stack.Screen name="Message" component={MessageScreen} />
        </stack.Navigator>
    )
}


export default ChoicePage;