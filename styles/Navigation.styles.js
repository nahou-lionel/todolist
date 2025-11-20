import { fontSize } from './theme'

export const getNavigationTheme = (colors) => ({
  screenOptions: {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: fontSize.small,
      fontWeight: '500',
    },
  },
});
