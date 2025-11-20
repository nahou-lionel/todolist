import { StyleSheet } from 'react-native'
import { getCommonStyles, spacing } from './theme'

export const createStyles = (colors, shadows) => {
  const commonStyles = getCommonStyles(colors, shadows);

  return StyleSheet.create({
    container: commonStyles.container,
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    title: commonStyles.title,
    subtitle: commonStyles.subtitle,
    button: commonStyles.button,
    buttonText: commonStyles.buttonText,
  });
};
