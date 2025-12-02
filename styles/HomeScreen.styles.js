import { StyleSheet } from 'react-native'
import { commonStyles, spacing, fontSize } from './theme'

export const createStyles = (colors, shadows) => {
  return StyleSheet.create({
    container: commonStyles.container,
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    greeting: {
      fontSize: fontSize.title,
      fontWeight: '300',
      color: colors.text,
      marginBottom: spacing.md,
      letterSpacing: 1,
    },
    username: {
      fontSize: fontSize.xlarge,
      fontWeight: '500',
      color: colors.primary,
      letterSpacing: 0.5,
    },
  });
};
