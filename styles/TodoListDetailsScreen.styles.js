import { StyleSheet } from "react-native";
import { getCommonStyles, spacing } from "./theme";

export const createStyles = (colors, shadows) => {
  const commonStyles = getCommonStyles(colors, shadows);

  return StyleSheet.create({
    container: {
      ...commonStyles.container,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md, // Réduit de xxl (60) à md (16)
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md, // Réduit de lg à md
    },
    title: {
      fontSize: 24, // Réduit de 42 à 24
      fontWeight: "600",
      color: colors.text,
      marginBottom: 0,
      flex: 1, // Permet au titre de prendre l'espace disponible
      marginRight: spacing.md, // Espace entre le titre et l'icône
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
