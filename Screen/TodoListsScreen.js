import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { TokenContext, UsernameContext } from "../Context/Context";
import {
  createTodoList,
  deleteTodoList,
  getTodoLists,
  updateTodoList,
} from "../components/TodoLists";
import { getTodos } from "../components/Todos";
import Input from "../components/UI/Input";
import TodoLists from "../components/UI/TodoLists";
import { styles } from "../styles/TodoListsScreen.styles";

export default function TodoListsScreen({ navigation }) {
  const [token] = useContext(TokenContext);
  const [username] = useContext(UsernameContext);
  const [todoLists, setTodoLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadTodoLists = useCallback(async () => {
    setLoading(true);
    try {
      const lists = await getTodoLists(token, username);

      // Charger les todos pour chaque liste pour calculer les stats
      const listsWithStats = await Promise.all(
        lists.map(async (list) => {
          try {
            const todos = await getTodos(token, list.id);
            const total = todos.length;
            const completed = todos.filter((todo) => todo.done).length;

            return {
              ...list,
              totalTodos: total,
              completedTodos: completed,
              completionPercentage: total > 0 ? (completed / total) * 100 : 0,
            };
          } catch (error) {
            // En cas d'erreur, retourner la liste sans stats
            return {
              ...list,
              totalTodos: 0,
              completedTodos: 0,
              completionPercentage: 0,
            };
          }
        })
      );

      setTodoLists(listsWithStats);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de charger les listes"
      );
      setLoading(false);
    }
  }, [token, username]);

  useFocusEffect(
    useCallback(() => {
      loadTodoLists();
    }, [loadTodoLists])
  );

  const newTodoList = () => {
    if (!newListTitle.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un titre");
      return;
    }
    setCreating(true);
    createTodoList(token, username, newListTitle.trim())
      .then((newList) => {
        setTodoLists([...todoLists, newList]);
        setNewListTitle("");
      })
      .catch((error) => {
        Alert.alert("Erreur", error.message || "Impossible de créer la liste");
      })
      .finally(() => {
        setCreating(false);
      });
  };

  const handleDeleteList = async (listId) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette liste ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTodoList(token, listId);
              setTodoLists(todoLists.filter((list) => list.id !== listId));
            } catch (error) {
              Alert.alert(
                "Erreur",
                error.message || "Impossible de supprimer la liste"
              );
            }
          },
        },
      ]
    );
  };

  const handleEditList = async (listId, newTitle) => {
    try {
      await updateTodoList(token, listId, newTitle);
      setTodoLists(
        todoLists.map((list) =>
          list.id === listId ? { ...list, title: newTitle } : list
        )
      );
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de modifier la liste");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#5886fe" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mes listes</Text>

        <Input
          value={newListTitle}
          onChangeText={setNewListTitle}
          onSubmit={newTodoList}
          placeholder="Nouvelle liste..."
          submitLabel="Créer"
          loading={creating}
          style={styles.createSection}
        />

        {todoLists.length === 0 ? (
          <Text style={styles.subtitle}>Aucune liste pour le moment</Text>
        ) : (
          <TodoLists
            data={todoLists}
            delete={handleDeleteList}
            edit={handleEditList}
            navigation={navigation}
          />
        )}
      </View>
    </View>
  );
}
