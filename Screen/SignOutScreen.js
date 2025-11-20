import {React, useContext} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'
import { createStyles } from '../styles/SignOutScreen.styles'
import { useTheme } from '../hooks/useTheme';

export default function SignOutScreen ({ navigation, route }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);
  const [token, setToken] = useContext(TokenContext)
  const [username, setUsername] = useContext(UsernameContext)
  const signOut = ()=>{
    setToken(null)
    setUsername(null)
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Déconnexion</Text>
        <Text style={styles.subtitle}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={signOut}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}