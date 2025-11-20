import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { fontSize, spacing } from "../../styles/theme";
import Progress from "./Progress";

export default function TodoListItem({
  item,
  onDelete,
  onEdit,
  navigation,
  style,
}) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  // Mettre à jour editedTitle quand item.title change (mais pas en mode édition)
  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(item.title);
    }
  }, [item.title, isEditing]);

  const handlePress = () => {
    if (!isEditing) {
      navigation?.navigate("Details", { id: item.id, title: item.title });
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditedTitle(item.title); // S'assurer d'avoir le titre actuel
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== item.title) {
      onEdit?.(item.id, editedTitle.trim());
    } else {
      setEditedTitle(item.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(item.title);
    setIsEditing(false);
  };

  const totalTodos = item.totalTodos || 0;
  const completedTodos = item.completedTodos || 0;
  const completionPercentage = item.completionPercentage || 0;

  const styles = StyleSheet.create({
    container: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    titleContainer: {
      flex: 1,
      marginRight: spacing.md,
    },
    title: {
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "500",
    },
    input: {
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "400",
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 4,
      backgroundColor: colors.card,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: spacing.sm,
      marginLeft: spacing.xs,
    },
    bottomRow: {
      marginTop: spacing.xs,
    },
    statsText: {
      fontSize: fontSize.small,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={isEditing}
      activeOpacity={isEditing ? 1 : 0.7}
    >
      {/* Ligne du haut : Titre et actions */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              onBlur={handleSave}
              onSubmitEditing={handleSave}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <Text style={styles.title}>{item.title}</Text>
          )}
        </View>

        <View style={styles.actions}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCancel}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSave}
              >
                <MaterialIcons name="check" size={24} color={colors.primary} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {onEdit && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEdit}
                >
                  <MaterialIcons name="edit" size={22} color={colors.primary} />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <MaterialIcons name="delete" size={24} color={colors.error} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Ligne du bas : Stats et progression */}
      <View style={styles.bottomRow}>
        <Text style={styles.statsText}>
          {completedTodos}/{totalTodos} tâches
        </Text>
        <Progress percentage={completionPercentage} />
      </View>
    </TouchableOpacity>
  );
}
