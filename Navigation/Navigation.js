import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TokenContext } from "../Context/Context";

import DetailsScreen from "../Screen/DetailsScreen";
import HomeScreen from "../Screen/HomeScreen";
import SignInScreen from "../Screen/SignInScreen";
import SignOutScreen from "../Screen/SignOutScreen";
import SignUpScreen from "../Screen/SignUpScreen";
import TodoListsScreen from "../Screen/TodoListsScreen";
import { navigationTheme } from "../styles/Navigation.styles";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for TodoLists and Details
function TodoListsStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TodoListsMain"
    >
      <Stack.Screen name="TodoListsMain" component={TodoListsScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <TokenContext.Consumer>
      {([token, setToken]) => (
        <NavigationContainer>
          {token == null ? (
            <Tab.Navigator screenOptions={navigationTheme.screenOptions}>
              <Tab.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ tabBarLabel: "Connexion" }}
              />
              <Tab.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ tabBarLabel: "Inscription" }}
              />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator screenOptions={navigationTheme.screenOptions}>
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: "Accueil" }}
              />
              <Tab.Screen
                name="TodoLists"
                component={TodoListsStack}
                options={{ tabBarLabel: "Mes listes" }}
              />
              <Tab.Screen
                name="SignOut"
                component={SignOutScreen}
                options={{ tabBarLabel: "Déconnexion" }}
              />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      )}
    </TokenContext.Consumer>
  );
}
