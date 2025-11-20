import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TokenContext } from "../Context/Context";

import DetailsScreen from "../Screen/DetailsScreen";
import SettingsScreen from "../Screen/SettingsScreen";
import SignInScreen from "../Screen/SignInScreen";
import SignUpScreen from "../Screen/SignUpScreen";
import TodoListsScreen from "../Screen/TodoListsScreen";
import { getNavigationTheme } from "../styles/Navigation.styles";
import { useTheme } from "../hooks/useTheme";

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

function NavigationContent() {
  const { colors, isDarkMode } = useTheme();
  const navigationTheme = getNavigationTheme(colors);

  // Theme pour NavigationContainer
  const reactNavigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <TokenContext.Consumer>
      {([token, setToken]) => (
        <NavigationContainer theme={reactNavigationTheme}>
          {token == null ? (
            <Tab.Navigator screenOptions={navigationTheme.screenOptions}>
              <Tab.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  tabBarLabel: "Connexion",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="login" size={size} color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  tabBarLabel: "Inscription",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="person-add" size={size} color={color} />
                  ),
                }}
              />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator screenOptions={navigationTheme.screenOptions}>
              <Tab.Screen
                name="TodoLists"
                component={TodoListsStack}
                options={{
                  tabBarLabel: "Mes listes",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="list" size={size} color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  tabBarLabel: "Paramètres",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="settings" size={size} color={color} />
                  ),
                }}
              />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      )}
    </TokenContext.Consumer>
  );
}

export default function Navigation() {
  return <NavigationContent />;
}
