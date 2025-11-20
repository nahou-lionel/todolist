import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
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

  // Cache pour conserver les références d'objets inchangés
  const listsCache = useRef({});

  // Mémoriser les listes pour éviter les re-créations d'objets
  const memoizedTodoLists = useMemo(() => {
    const cache = listsCache.current;
    const newCache = {};
    const newLists = [];

    todoLists.forEach((list) => {
      const cachedList = cache[list.id];

      // Si la liste en cache existe et que rien n'a changé, réutiliser l'objet
      if (
        cachedList &&
        cachedList.id === list.id &&
        cachedList.title === list.title &&
        cachedList.totalTodos === list.totalTodos &&
        cachedList.completedTodos === list.completedTodos &&
        cachedList.completionPercentage === list.completionPercentage
      ) {
        newCache[list.id] = cachedList;
        newLists.push(cachedList);
      } else {
        // Sinon, créer un nouvel objet
        newCache[list.id] = list;
        newLists.push(list);
      }
    });

    // Mettre à jour le cache
    listsCache.current = newCache;
    return newLists;
  }, [todoLists]);

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

  const handleDeleteList = useCallback(
    async (listId) => {
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
                setTodoLists((prevLists) =>
                  prevLists.filter((list) => list.id !== listId)
                );
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
    },
    [token]
  );

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
        Alert.alert(
          "Erreur",
          error.message || "Impossible de modifier la liste"
        );
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
            data={memoizedTodoLists}
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
    </View>
  );
}
