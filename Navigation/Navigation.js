import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TokenContext } from '../Context/Context'

import TodoListsScreen from '../Screen/TodoListsScreen'
import HomeScreen from '../Screen/HomeScreen'
import SignInScreen from '../Screen/SignInScreen'
import SignOutScreen from '../Screen/SignOutScreen'
import SignUpScreen from '../Screen/SignUpScreen'
import { navigationTheme } from '../styles/Navigation.styles'

const Tab = createBottomTabNavigator()

export default function Navigation () {
  return (
    <TokenContext.Consumer>
      {([token, setToken]) => (
        <NavigationContainer>
          {token == null ? (
            <Tab.Navigator screenOptions={navigationTheme.screenOptions}>
              <Tab.Screen
                name='SignIn'
                component={SignInScreen}
                options={{ tabBarLabel: 'Connexion' }}
              />
              <Tab.Screen
                name='SignUp'
                component={SignUpScreen}
                options={{ tabBarLabel: 'Inscription' }}
              />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator screenOptions={navigationTheme.screenOptions}>
              <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{ tabBarLabel: 'Accueil' }}
              />
              <Tab.Screen
                name='TodoLists'
                component={TodoListsScreen}
                options={{ tabBarLabel: 'Mes listes' }}
              />
              <Tab.Screen
                name='SignOut'
                component={SignOutScreen}
                options={{ tabBarLabel: 'Déconnexion' }}
              />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      )}
    </TokenContext.Consumer>
  )
}
