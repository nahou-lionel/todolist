import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

/**
 * Modal de confirmation avec saisie de texte
 * @param {boolean} visible - Visibilité du modal
 * @param {Function} onClose - Callback pour fermer le modal
 * @param {Function} onConfirm - Callback pour confirmer l'action avec la valeur saisie
 * @param {string} title - Titre du modal
 * @param {string} message - Message de confirmation
 * @param {string} placeholder - Placeholder pour l'input
 * @param {string} expectedValue - Valeur attendue pour activer le bouton de confirmation
 * @param {string} confirmText - Texte du bouton de confirmation
 * @param {boolean} loading - État de chargement
 */
export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  placeholder,
  expectedValue,
  confirmText = "Confirmer",
  loading = false,
}) {
  const { colors, spacing, fontSize, borderRadius, shadows } = useTheme();
  const [inputValue, setInputValue] = useState("");

  // Réinitialiser l'input quand le modal se ferme
  useEffect(() => {
    if (!visible) {
      setInputValue("");
    }
  }, [visible]);

  const handleConfirm = () => {
    if (inputValue === expectedValue) {
      onConfirm(inputValue);
    }
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const isValid = inputValue === expectedValue;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.xl,
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.large,
      width: "100%",
      maxWidth: 400,
      ...shadows.medium,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.large,
      fontWeight: "600",
      color: colors.text,
    },
    modalContent: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    message: {
      fontSize: fontSize.regular,
      color: colors.text,
      marginBottom: spacing.lg,
      lineHeight: 22,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      fontSize: fontSize.regular,
      color: colors.text,
      backgroundColor: colors.card,
    },
    modalActions: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.medium,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    },
    cancelButton: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "500",
    },
    confirmButton: {
      backgroundColor: colors.error,
    },
    confirmButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.5,
    },
    confirmButtonText: {
      fontSize: fontSize.medium,
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* En-tête */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <View style={styles.modalContent}>
            <Text style={styles.message}>{message}</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholder}
              autoFocus
              editable={!loading}
            />
          </View>

          {/* Boutons d'action */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.confirmButton,
                (!isValid || loading) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
