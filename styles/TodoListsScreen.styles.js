import { StyleSheet } from "react-native";
import {
  borderRadius,
  commonStyles,
  fontSize,
  spacing,
} from "./theme";

export const createStyles = (colors, shadows) => {
  return StyleSheet.create({
    colors: colors,
    container: commonStyles.container,
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxl,
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: "300",
      color: colors.text,
      marginBottom: spacing.xs,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: fontSize.large,
      color: colors.textSecondary,
      fontWeight: "300",
      marginTop: spacing.xl,
    },
    createSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    input: {
      flex: 1,
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.regular,
      color: colors.text,
      backgroundColor: colors.background,
    },
    createButton: {
      height: 48,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.medium,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 80,
    },
    createButtonDisabled: {
      opacity: 0.6,
    },
    createButtonText: {
      color: "#FFFFFF",
      fontSize: fontSize.regular,
      fontWeight: "500",
    },
    list: {
      flex: 1,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    listTitle: {
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "400",
      flex: 1,
    },
    deleteButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.error,
      borderRadius: borderRadius.small,
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: fontSize.small,
      fontWeight: "500",
    },
  });
};
