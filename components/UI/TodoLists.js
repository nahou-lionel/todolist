import React from "react";
import { FlatList, StyleSheet } from "react-native";
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
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      removeClippedSubviews={false}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
