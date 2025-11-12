import { colors, fontSize } from './theme'

export const navigationTheme = {
  screenOptions: {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.placeholder,
    tabBarLabelStyle: {
      fontSize: fontSize.small,
      fontWeight: '500',
    },
  },
}
