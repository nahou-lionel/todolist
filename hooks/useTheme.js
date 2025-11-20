import { useContext } from "react";
import { useColorScheme } from "react-native";
import {
  borderRadius,
  fontSize,
  getColors,
  getShadows,
  spacing,
} from "../styles/theme";
import { ThemeContext } from "../Context/Context";

/**
 * Hook personnalisé pour gérer le thème de l'application
 * Utilise ThemeContext pour le contrôle manuel du thème
 * ou useColorScheme de React Native pour le mode automatique
 *
 * @returns {Object} Objet contenant les couleurs, isDarkMode, themeMode, setThemeMode et autres styles
 */
export const useTheme = () => {
  const [themeMode, setThemeMode] = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();

  // Déterminer si le mode sombre est actif
  const isDarkMode =
    themeMode === 'dark' ||
    (themeMode === 'auto' && systemColorScheme === 'dark');

  const colors = getColors(isDarkMode);
  const shadows = getShadows(colors);

  return {
    colors,
    isDarkMode,
    themeMode,
    setThemeMode,
    systemColorScheme,
    spacing,
    fontSize,
    borderRadius,
    shadows,
  };
};
