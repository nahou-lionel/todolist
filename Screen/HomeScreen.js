import React, {useContext} from "react";
import { View, Text} from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'
import { createStyles } from '../styles/HomeScreen.styles'
import { useTheme } from '../hooks/useTheme';


export default function HomeScreen () {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);
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