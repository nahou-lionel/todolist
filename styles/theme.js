// Couleurs du thème clair
export const lightColors = {
  // Couleurs principales
  primary: "#5886fe",
  background: "#FFFFFF",
  text: "#292929",
  card: "#FFFFFF",

  // Couleurs secondaires
  textSecondary: "#888",
  placeholder: "#AAAAAA",
  border: "#E8E8E8",

  // Couleurs d'état
  error: "#ff6b6b",
  success: "#51cf66",
};

// Couleurs du thème sombre
export const darkColors = {
  // Couleurs principales
  primary: "#5886fe",
  background: "#000000",
  text: "#FFFFFF",
  card: "#1C1C1E",

  // Couleurs secondaires
  textSecondary: "#8E8E93",
  placeholder: "#636366",
  border: "#38383A",

  // Couleurs d'état
  error: "#ff6b6b",
  success: "#51cf66",
};

// Fonction pour obtenir les couleurs selon le thème
export const getColors = (isDarkMode) =>
  isDarkMode ? darkColors : lightColors;

// Export par défaut (light mode) pour compatibilité
export const colors = lightColors;

// Espacements
export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 60,
};

// Tailles de police
export const fontSize = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  title: 42,
};

// Rayons de bordure
export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
};

// Fonction pour obtenir les ombres selon les couleurs
export const getShadows = (colors) => ({
  button: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});

// Export par défaut (light mode) pour compatibilité
export const shadows = getShadows(lightColors);

// Fonction pour obtenir les styles communs selon les couleurs et ombres
export const getCommonStyles = (colors, shadows) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: "300",
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.large,
    color: colors.textSecondary,
    marginBottom: 60,
    fontWeight: "300",
  },
  input: {
    height: 56,
    backgroundColor: colors.card,
    borderRadius: borderRadius.medium,
    paddingHorizontal: 20,
    fontSize: fontSize.medium,
    color: colors.text,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
    ...shadows.button,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: fontSize.medium,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.regular,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
});

// Export par défaut (light mode) pour compatibilité
export const commonStyles = getCommonStyles(lightColors, shadows);
