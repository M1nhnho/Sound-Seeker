import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarLabelStyle: { color: 'white' },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="black" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarLabelStyle: { color: 'white' },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Text>Icon One</Text>
            ) : (
              <Text>Icon Two</Text>
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator()

function Navigation(){
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name='main' component={BottomTabs} options={{headerShown:false}}/>
         </Stack.Navigator>
      </NavigationContainer>
   )
}

export default Navigation