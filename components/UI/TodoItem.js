import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, fontSize, spacing } from "../../styles/theme";

export default function TodoItem({ item, onToggle, onDelete, onEdit, style }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContent.trim() && editedContent !== item.content) {
      onEdit?.(item.id, editedContent.trim());
    } else {
      setEditedContent(item.content);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(item.content);
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onToggle}
        activeOpacity={0.7}
        disabled={isEditing}
      >
        <MaterialIcons
          name={item.done ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={item.done ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editedContent}
          onChangeText={setEditedContent}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          autoFocus
          selectTextOnFocus
          multiline
        />
      ) : (
        <Text style={[styles.content, item.done && styles.contentDone]}>
          {item.content}
        </Text>
      )}

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCancel}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <MaterialIcons name="check" size={20} color={colors.primary} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <MaterialIcons name="edit" size={18} color={colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <MaterialIcons name="delete" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  checkboxContainer: {
    marginRight: spacing.md,
  },
  content: {
    fontSize: fontSize.regular,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  contentDone: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  input: {
    fontSize: fontSize.regular,
    color: colors.text,
    flex: 1,
    padding: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    backgroundColor: colors.background,
    minHeight: 40,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  deleteButton: {
    padding: spacing.sm,
  },
});
