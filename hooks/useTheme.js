import { useContext } from "react";
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
 *
 * @returns {Object} Objet contenant les couleurs, isDarkMode, themeMode, setThemeMode et autres styles
 */
export const useTheme = () => {
  const [themeMode, setThemeMode] = useContext(ThemeContext);

  // Déterminer si le mode sombre est actif
  const isDarkMode = themeMode === 'dark';

  const colors = getColors(isDarkMode);
  const shadows = getShadows(colors);

  return {
    colors,
    isDarkMode,
    themeMode,
    setThemeMode,
    spacing,
    fontSize,
    borderRadius,
    shadows,
  };
};
