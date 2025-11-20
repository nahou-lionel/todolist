import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import TodoListItem from "./TodoListItem";

function TodoLists(props) {
  // Mémoriser la fonction de rendu pour éviter les re-créations
  const renderItem = useCallback(({ item }) => (
    <TodoListItem
      item={item}
      onDelete={props.delete}
      onEdit={props.edit}
      navigation={props.navigation}
    />
  ), [props.delete, props.edit, props.navigation]);

  return (
    <FlatList
      data={props.data}
      renderItem={renderItem}
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

export default React.memo(TodoLists);

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
