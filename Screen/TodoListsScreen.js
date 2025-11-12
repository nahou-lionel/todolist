import React from "react";
import { View, Text} from "react-native";
import { styles } from '../styles/TodoListsScreen.styles'

export default function TodoListsScreen(){
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Mes listes</Text>
                <Text style={styles.subtitle}>Aucune liste pour le moment</Text>
            </View>
        </View>
    )
}