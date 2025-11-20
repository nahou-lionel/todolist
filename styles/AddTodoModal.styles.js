import { StyleSheet } from "react-native";
import { borderRadius, fontSize, spacing } from "./theme";

export const createStyles = (colors, shadows) =>
  StyleSheet.create({
    // Modal overlay
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },

    // Conteneur du modal
    modalContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: borderRadius.large,
      borderTopRightRadius: borderRadius.large,
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      maxHeight: "80%",
      ...shadows.button,
    },

    // En-tête du modal
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    modalTitle: {
      fontSize: fontSize.xlarge,
      fontWeight: "600",
      color: colors.text,
    },

    // Contenu scrollable
    modalContent: {
      marginBottom: spacing.lg,
    },

    // Label
    label: {
      fontSize: fontSize.medium,
      fontWeight: "500",
      color: colors.text,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },

    // Input texte
    input: {
      fontSize: fontSize.regular,
      color: colors.text,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      backgroundColor: colors.background,
      minHeight: 80,
      textAlignVertical: "top",
    },

    // Boutons d'action du modal
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    modalButton: {
      flex: 1,
      height: 48,
      borderRadius: borderRadius.medium,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: fontSize.medium,
      fontWeight: "500",
    },
    submitButton: {
      backgroundColor: colors.primary,
      ...shadows.button,
    },
    submitButtonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: fontSize.medium,
      fontWeight: "600",
    },
  });
