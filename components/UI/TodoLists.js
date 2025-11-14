import React from "react";
import { FlatList } from "react-native";
import { styles } from "../../styles/TodoListsScreen.styles";
import TodoListItem from "./TodoListItem";

export default function TodoLists(props) {
  return (
    <FlatList
      data={props.data}
      renderItem={({ item }) => (
        <TodoListItem
          item={item}
          onDelete={props.delete}
          onEdit={props.edit}
          navigation={props.navigation}
        />
      )}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
}
