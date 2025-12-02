import { StyleSheet } from "react-native";
import { commonStyles, spacing } from "./theme";

export const createStyles = (colors, shadows) => {
  return StyleSheet.create({
    container: {
      ...commonStyles.container,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 0,
      flex: 1,
      marginRight: spacing.md,
    },
    subtitle: {
      ...commonStyles.subtitle,
      textAlign: "center",
      marginTop: spacing.xxl,
    },
    createSection: {
      marginBottom: spacing.sm,
    },
    actionButtons: {
      marginBottom: spacing.lg,
    },
    list: {
      flex: 1,
    },
  });
};
