import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { TokenContext } from "../Context/Context";
import { styles } from "../styles/TodoListDetailsScreen.styles";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./Todos";
import Input from "./UI/Input";
import TodoItem from "./UI/TodoItem";

export default function TodoListDetails({ navigation, route }) {
  const [token] = useContext(TokenContext);
  const [todos, setTodos] = useState([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getTodos(token, route.params.id)
      .then((fetchedTodos) => {
        setLoading(true);
        setTodos(fetchedTodos);
      })
      .catch((error) => {
        Alert.alert(
          "Erreur",
          error.message || "Impossible de charger les todos"
        );
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [todos]);

  const handleCreateTodo = () => {
    if (!newTodoContent.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un contenu");
      return;
    }
    setCreating(true);
    createTodo(token, route.params.id, newTodoContent.trim())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setNewTodoContent("");
      })
      .catch((error) => {
        Alert.alert("Erreur", error.message || "Impossible de cr�er le todo");
      })
      .finally(() => {
        setCreating(false);
      });
  };

  const handleToggleTodo = async (todoId, currentDone) => {
    try {
      const updatedTodo = await updateTodo(token, todoId, { done: !currentDone });
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, done: updatedTodo.done } : todo
        )
      );
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de modifier le todo");
    }
  };

  const handleEditTodo = async (todoId, newContent) => {
    try {
      const updatedTodo = await updateTodo(token, todoId, { content: newContent });
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, content: updatedTodo.content } : todo
        )
      );
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de modifier le todo"
      );
    }
  };

  const handleDeleteTodo = async (todoId) => {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer ce todo ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(token, todoId);
            setTodos(todos.filter((todo) => todo.id !== todoId));
          } catch (error) {
            Alert.alert(
              "Erreur",
              error.message || "Impossible de supprimer le todo"
            );
          }
        },
      },
    ]);
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
        <Text style={styles.title}>Détails de la liste</Text>

        <Input
          value={newTodoContent}
          onChangeText={setNewTodoContent}
          onSubmit={handleCreateTodo}
          placeholder="Nouveau todo..."
          submitLabel="Ajouter"
          loading={creating}
          style={styles.createSection}
        />

        {todos.length === 0 ? (
          <Text style={styles.subtitle}>Aucun todo pour le moment</Text>
        ) : (
          <FlatList
            data={todos}
            renderItem={({ item }) => (
              <TodoItem
                item={item}
                onToggle={() => handleToggleTodo(item.id, item.done)}
                onEdit={handleEditTodo}
                onDelete={() => handleDeleteTodo(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        )}
      </View>
    </View>
  );
}
