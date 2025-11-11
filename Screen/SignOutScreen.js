import {React, useContext} from "react";
import { View, Button } from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'

export default function SignOutScreen ({ navigation, route }) {
  const [token, setToken] = useContext(TokenContext)
  const [username, setUsername] = useContext(UsernameContext)
  const signOut = ()=>{
    setToken(null)
    setUsername(null)
  }
  return <Button title='Sign me out' onPress={signOut} />
}