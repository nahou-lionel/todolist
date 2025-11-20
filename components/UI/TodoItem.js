import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect, useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fontSize, spacing } from "../../styles/theme";
import { useTheme } from "../../hooks/useTheme";

const TodoItem = ({ item, onToggle, onDelete, onEdit, style }) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  // Mettre à jour editedContent quand item.content change (mais pas en mode édition)
  useEffect(() => {
    if (!isEditing) {
      setEditedContent(item.content);
    }
  }, [item.content, isEditing]);

  const handleEdit = () => {
    setEditedContent(item.content); // S'assurer d'avoir le contenu actuel
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

  // Mémoriser les styles pour éviter les re-renders
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "column",
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        },
        mainRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        checkboxContainer: {
          marginRight: spacing.md,
        },
        contentColumn: {
          flex: 1,
          marginRight: spacing.md,
        },
        content: {
          fontSize: fontSize.regular,
          color: colors.text,
        },
        contentDone: {
          textDecorationLine: "line-through",
          color: colors.textSecondary,
        },
        todoImage: {
          width: "100%",
          height: 150,
          borderRadius: 8,
          marginTop: spacing.sm,
          resizeMode: "cover",
        },
        todoImageEditing: {
          opacity: 0.4,
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
          backgroundColor: colors.card,
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
      }),
    [colors]
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainRow}>
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
            onSubmitEditing={handleSave}
            autoFocus
            selectTextOnFocus
            multiline
          />
        ) : (
          <View style={styles.contentColumn}>
            <Text style={[styles.content, item.done && styles.contentDone]}>
              {item.content}
            </Text>
          </View>
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSave}
              >
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
                  <MaterialIcons
                    name="edit"
                    size={18}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onDelete}
                >
                  <MaterialIcons name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Affichage de l'image si elle existe - Visible même en édition pour éviter le re-layout */}
      {item.imageUri && (
        <Image
          source={{ uri: item.imageUri }}
          style={[styles.todoImage, isEditing && styles.todoImageEditing]}
        />
      )}
    </View>
  );
};

// Mémoiser le composant pour éviter les re-renders inutiles
export default React.memo(TodoItem, (prevProps, nextProps) => {
  // Ne re-render que si ces props changent
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.content === nextProps.item.content &&
    prevProps.item.done === nextProps.item.done &&
    prevProps.item.imageUri === nextProps.item.imageUri
  );
});
