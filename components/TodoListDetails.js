import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { TokenContext } from "../Context/Context";
import { useTheme } from "../hooks/useTheme";
import { useImagePicker } from "../hooks/useImagePicker";
import { exportTodoList } from "../services/exportService";
import { deleteImageLocally, saveImageLocally } from "../services/imageStorageService";
import { createStyles } from "../styles/TodoListDetailsScreen.styles";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./Todos";
import AddTodoModal from "./UI/AddTodoModal";
import ExportButton from "./UI/ExportButton";
import FloatingActionButton from "./UI/FloatingActionButton";
import TodoItem from "./UI/TodoItem";

const TODO_IMAGES_STORAGE_KEY = "TODO_IMAGES";

export default function TodoListDetails({ navigation, route }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);
  const [token] = useContext(TokenContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // State local pour stocker les associations todo <-> image
  const [todoImages, setTodoImages] = useState({});

  // Charger les associations todo-image depuis AsyncStorage
  useEffect(() => {
    const loadTodoImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem(TODO_IMAGES_STORAGE_KEY);
        if (storedImages) {
          setTodoImages(JSON.parse(storedImages));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
      }
    };

    loadTodoImages();
  }, []);

  // Sauvegarder les associations todo-image dans AsyncStorage
  useEffect(() => {
    const saveTodoImages = async () => {
      try {
        await AsyncStorage.setItem(TODO_IMAGES_STORAGE_KEY, JSON.stringify(todoImages));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des images:", error);
      }
    };

    if (Object.keys(todoImages).length > 0) {
      saveTodoImages();
    }
  }, [todoImages]);

  useEffect(() => {
    getTodos(token, route.params.id)
      .then((fetchedTodos) => {
        setTodos(fetchedTodos);
      })
      .catch((error) => {
        Alert.alert(
          "Erreur",
          error.message || "Impossible de charger les todos"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, route.params.id]);

  const handleExport = async (listTitle, todos, format) => {
    await exportTodoList(listTitle, todos, format);
  };

  const handleCreateTodo = async (todoContent, imageUri) => {
    if (!todoContent.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un contenu");
      return;
    }

    setCreating(true);

    try {
      // Créer le todo
      const newTodo = await createTodo(token, route.params.id, todoContent);

      // Si une image est sélectionnée, la sauvegarder localement
      if (imageUri) {
        try {
          const savedImageUri = await saveImageLocally(imageUri);
          // Associer l'image au todo dans le state local
          setTodoImages(prev => ({
            ...prev,
            [newTodo.id]: savedImageUri
          }));
        } catch (imageError) {
          console.error("Erreur lors de la sauvegarde de l'image:", imageError);
          Alert.alert("Attention", "Le todo a été créé mais l'image n'a pas pu être sauvegardée");
        }
      }

      setTodos([...todos, newTodo]);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de créer le todo");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTodo = useCallback(async (todoId, currentDone) => {
    try {
      const updatedTodo = await updateTodo(token, todoId, {
        done: !currentDone,
      });
      setTodos(prevTodos =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, done: updatedTodo.done } : todo
        )
      );
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de modifier le todo");
    }
  }, [token]);

  const handleEditTodo = useCallback(async (todoId, newContent) => {
    try {
      const updatedTodo = await updateTodo(token, todoId, {
        content: newContent,
      });
      setTodos(prevTodos =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, content: updatedTodo.content } : todo
        )
      );
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de modifier le todo");
    }
  }, [token]);

  const handleDeleteTodo = useCallback(async (todoId) => {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer ce todo ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            // Supprimer l'image associée si elle existe
            setTodoImages(prev => {
              if (prev[todoId]) {
                deleteImageLocally(prev[todoId]).catch(err =>
                  console.error("Erreur suppression image:", err)
                );
                const newImages = { ...prev };
                delete newImages[todoId];
                return newImages;
              }
              return prev;
            });

            await deleteTodo(token, todoId);
            setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== todoId));
          } catch (error) {
            Alert.alert(
              "Erreur",
              error.message || "Impossible de supprimer le todo"
            );
          }
        },
      },
    ]);
  }, [token]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* En-tête avec titre et bouton export */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {route.params.title || "Détails de la liste"}
          </Text>
          <ExportButton
            listTitle={route.params.title}
            todos={todos}
            onExport={handleExport}
          />
        </View>

        {todos.length === 0 ? (
          <Text style={styles.subtitle}>Aucun todo pour le moment</Text>
        ) : (
          <FlatList
            data={todos}
            renderItem={({ item }) => {
              const todoWithImage = { ...item, imageUri: todoImages[item.id] };
              return (
                <TodoItem
                  item={todoWithImage}
                  onToggle={() => handleToggleTodo(item.id, item.done)}
                  onEdit={handleEditTodo}
                  onDelete={() => handleDeleteTodo(item.id)}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            removeClippedSubviews={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          />
        )}
      </View>

      {/* Bouton flottant pour ajouter une tâche */}
      <FloatingActionButton onPress={() => setModalVisible(true)} />

      {/* Modal pour ajouter une tâche */}
      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateTodo}
        loading={creating}
      />
    </View>
  );
}
