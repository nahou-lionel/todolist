import { StyleSheet } from 'react-native'
import { colors, spacing, commonStyles } from './theme'

export const styles = StyleSheet.create({
  container: commonStyles.container,
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: commonStyles.title,
  subtitle: commonStyles.subtitle,
  form: {
    width: '100%',
  },
  input: commonStyles.input,
  button: commonStyles.button,
  buttonText: commonStyles.buttonText,
  error: commonStyles.error,
})
