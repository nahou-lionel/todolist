import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, commonStyles } from './theme'

export const styles = StyleSheet.create({
  container: commonStyles.container,
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '300',
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.large,
    color: colors.textSecondary,
    fontWeight: '300',
  },
})
