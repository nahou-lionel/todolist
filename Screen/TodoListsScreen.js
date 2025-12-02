import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useState,
} from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
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
import AlertModal from "../components/UI/AlertModal";
import { useTheme } from "../hooks/useTheme";
import { createStyles } from "../styles/TodoListsScreen.styles";

export default function TodoListsScreen({ navigation }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);
  const [token] = useContext(TokenContext);
  const [username] = useContext(UsernameContext);
  const [todoLists, setTodoLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // États pour les modals
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

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
      setErrorMessage(error.message || "Impossible de charger les listes");
      setErrorModalVisible(true);
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
      setErrorMessage("Veuillez entrer un titre");
      setErrorModalVisible(true);
      return;
    }
    setCreating(true);
    createTodoList(token, username, newListTitle.trim())
      .then((newList) => {
        setTodoLists([...todoLists, newList]);
        setNewListTitle("");
      })
      .catch((error) => {
        setErrorMessage(error.message || "Impossible de créer la liste");
        setErrorModalVisible(true);
      })
      .finally(() => {
        setCreating(false);
      });
  };

  const handleDeleteList = useCallback(
    async (listId) => {
      setListToDelete(listId);
      setDeleteConfirmVisible(true);
    },
    []
  );

  const confirmDeleteList = async () => {
    setDeleteConfirmVisible(false);
    try {
      await deleteTodoList(token, listToDelete);
      setTodoLists((prevLists) =>
        prevLists.filter((list) => list.id !== listToDelete)
      );
    } catch (error) {
      setErrorMessage(error.message || "Impossible de supprimer la liste");
      setErrorModalVisible(true);
    }
  };

  const handleEditList = useCallback(
    async (listId, newTitle) => {
      try {
        await updateTodoList(token, listId, newTitle);
        setTodoLists((prevLists) =>
          prevLists.map((list) =>
            list.id === listId ? { ...list, title: newTitle } : list
          )
        );
      } catch (error) {
        setErrorMessage(error.message || "Impossible de modifier la liste");
        setErrorModalVisible(true);
      }
    },
    [token]
  );

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
        <Text style={styles.title}>Mes listes</Text>

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

        <Input
          value={newListTitle}
          onChangeText={setNewListTitle}
          onSubmit={newTodoList}
          placeholder="Nouvelle liste..."
          submitLabel="Créer"
          loading={creating}
          style={styles.createSection}
        />
      </View>

      {/* Modal d'erreur */}
      <AlertModal
        visible={errorModalVisible}
        title="Erreur"
        message={errorMessage}
        buttons={[
          {
            text: "OK",
            onPress: () => setErrorModalVisible(false),
          },
        ]}
      />

      {/* Modal de confirmation de suppression */}
      <AlertModal
        visible={deleteConfirmVisible}
        title="Confirmation"
        message="Voulez-vous vraiment supprimer cette liste ?"
        buttons={[
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => setDeleteConfirmVisible(false),
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: confirmDeleteList,
          },
        ]}
      />
    </View>
  );
}
