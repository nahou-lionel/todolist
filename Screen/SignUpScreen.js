import {React, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform} from "react-native";
import { TokenContext, UsernameContext } from '../Context/Context'
import { signUp } from "../components/SignUp"
import { styles } from '../styles/SignUpScreen.styles'
import { colors } from '../styles/theme';

export default function SignUpScreen ({ navigation }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [confPassword, setConfPassword] = useState("")
  const [error, setError] = useState("")

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
                            // Navigation automatique via TokenContext
                        })
                        .catch(err => {
                            setError(err.message)
                        })
                }else{
                    setError("Les deux mots de passe sont différents");
                }
            }
            return (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
              >
                <View style={styles.content}>
                  <Text style={styles.title}>Inscription</Text>
                  <Text style={styles.subtitle}>Créer un compte</Text>

                  <View style={styles.form}>
                    <TextInput
                      style={styles.input}
                      onChangeText={setLogin}
                      value={login}
                      placeholder="Nom d'utilisateur"
                      placeholderTextColor={colors.placeholder}
                      autoCapitalize="none"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={setPassword}
                      value={password}
                      secureTextEntry={true}
                      placeholder="Mot de passe"
                      placeholderTextColor={colors.placeholder}
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={setConfPassword}
                      value={confPassword}
                      secureTextEntry={true}
                      placeholder="Confirmer le mot de passe"
                      placeholderTextColor={colors.placeholder}
                    />

                    {error ? (
                      <Text style={styles.error}>{error}</Text>
                    ) : null}

                    <TouchableOpacity
                      style={styles.button}
                      onPress={onSubmit}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.buttonText}>S'inscrire</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            )
          }}
        </UsernameContext.Consumer>
      )}
    </TokenContext.Consumer>
  )
}