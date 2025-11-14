import { StyleSheet } from "react-native";
import { colors, commonStyles, spacing } from "./theme";

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    ...commonStyles.title,
  },
  subtitle: {
    ...commonStyles.subtitle,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  createSection: {
    marginBottom: spacing.lg,
  },
  list: {
    flex: 1,
  },
});
