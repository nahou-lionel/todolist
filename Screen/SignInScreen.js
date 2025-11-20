import { React, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { signIn } from "../components/SignIn";
import Progress from "../components/UI/Progress";
import { TokenContext, UsernameContext } from "../Context/Context";
import { useTheme } from "../hooks/useTheme";
import { createStyles } from "../styles/SignInScreen.styles";

export default function SignInScreen({ navigation }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <TokenContext.Consumer>
      {([token, setToken]) => (
        <UsernameContext.Consumer>
          {([username, setUsername]) => {
            const onSubmit = () => {
              signIn(login, password)
                .then((token) => {
                  setToken(token);
                  setUsername(login);
                  // Navigation automatique via TokenContext
                })
                .catch((err) => {
                  setError(err.message);
                });
            };

            return (
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
              >
                <View style={styles.content}>
                  <Text style={styles.title}>Connexion</Text>
                  <Text style={styles.subtitle}>Bienvenue</Text>

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

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                      style={styles.button}
                      onPress={onSubmit}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            );
          }}
        </UsernameContext.Consumer>
      )}
    </TokenContext.Consumer>
  );
}
