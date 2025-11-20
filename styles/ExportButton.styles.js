import { StyleSheet } from "react-native";
import { spacing, fontSize, borderRadius } from "./theme";

export const createStyles = (colors, shadows) =>
  StyleSheet.create({
    // Bouton icône d'export
    exportIconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Modal overlay
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    // Conteneur du modal
    modalContainer: {
      width: "85%",
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: borderRadius.large,
      padding: spacing.lg,
      ...shadows.button,
    },

    // En-tête du modal
    modalHeader: {
      marginBottom: spacing.lg,
    },
    modalTitle: {
      fontSize: fontSize.xlarge,
      fontWeight: "600",
      color: colors.text,
      marginBottom: spacing.xs,
    },
    modalSubtitle: {
      fontSize: fontSize.regular,
      color: colors.textSecondary,
      fontWeight: "300",
    },

    // Liste des formats
    formatList: {
      marginBottom: spacing.lg,
    },

    // Option de format
    formatOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm,
      backgroundColor: colors.background,
    },
    formatOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10", // 10% d'opacité
    },

    // Icône du format
    formatIcon: {
      fontSize: 24,
      marginRight: spacing.md,
      minWidth: 30,
      textAlign: "center",
    },

    // Contenu du format
    formatContent: {
      flex: 1,
    },
    formatLabel: {
      fontSize: fontSize.medium,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    formatDescription: {
      fontSize: fontSize.small,
      color: colors.textSecondary,
      fontWeight: "300",
    },

    // Indicateur de sélection
    formatCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    formatCheckboxSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    formatCheckmark: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
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
    exportButtonConfirm: {
      backgroundColor: colors.primary,
      ...shadows.button,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: fontSize.medium,
      fontWeight: "500",
    },
    exportButtonConfirmText: {
      color: "#FFFFFF",
      fontSize: fontSize.medium,
      fontWeight: "600",
    },

    // État de chargement
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      color: "#FFFFFF",
      fontSize: fontSize.medium,
      fontWeight: "600",
      marginLeft: spacing.sm,
    },
  });
