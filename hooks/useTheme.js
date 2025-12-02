import {
  borderRadius,
  fontSize,
  colors,
  shadows,
  spacing,
} from "../styles/theme";

/**
 * Hook personnalisé pour retourner les valeurs du thème de l'application
 * @returns {Object} Objet contenant les couleurs, spacing, fontSize, borderRadius, shadows
 */
export const useTheme = () => {
  return {
    colors,
    spacing,
    fontSize,
    borderRadius,
    shadows,
  };
};
