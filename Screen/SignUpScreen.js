import {React, useState} from "react";
import { View, StyleSheet, TextInput, Text, Button} from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'
import { signUp } from "../components/SignUp";

export default function SignUpScreen ({ navigation }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [confPassword, setConfPassword] = useState("")
  const [error, setError] = useState("")

  

  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
});

  return (
    <TokenContext.Consumer>
      {([token, setToken]) => (
        <UsernameContext.Consumer>
          
          {([username, setUsername]) => {
            const onSubmit = () => {
                if (password === confPassword){

                    signUp(login, password)
                        .then(token => {
                            setToken(token)
                            setUsername(login)
                            props.navigate('SignIn')
                        })
                        .catch(err => {
                            setError(err.message)
                        })
                }else{
                    setError("Les deux mot de passe sont différents");
                }
            }
            return (
              <View>
                <TextInput
                  style={styles.input}
                  onChangeText={setLogin}
                  value={login}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Mot de passe"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setConfPassword}
                  value={confPassword}
                  secureTextEntry={true}
                  placeholder="Confirmer le Mot de passe"
                />
                <Button
                  onPress={onSubmit}
                  title="S'inscrire"
                  color="#841584"
                />
                <Text>{error}</Text>
              </View>
            )

          }}
        </UsernameContext.Consumer>
      )}
    </TokenContext.Consumer>
  )
}