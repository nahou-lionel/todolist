import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "../../styles/FloatingActionButton.styles";

/**
 * Bouton flottant (FAB) pour ajouter une nouvelle tâche
 * @param {Function} onPress - Callback lors du clic
 */
export default function FloatingActionButton({ onPress }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name="add" size={32} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
