import React, {useContext} from "react";
import { View, Text} from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'
import { styles } from '../styles/HomeScreen.styles'


export default function HomeScreen () {
  const [username, setUsername] = useContext(UsernameContext)
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Bienvenue !</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
    </View>
  )
}