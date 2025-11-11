import {React, useState} from "react";
import { View, StyleSheet, TextInput, Text, Button} from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'
import { signIn } from "../components/SignIn";

export default function SignInScreen ({ navigation }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
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
              signIn(login, password)
                    .then(token => {
                      setToken(token)
                      setUsername(login)
                      props.navigate('Home')
                    })
                    .catch(err => {
                      setError(err.message)
                    })
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
                  placeholder="Your password"
                />
                <Button
                  onPress={onSubmit}
                  title="Se connecter"
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