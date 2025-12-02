import React from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "../../styles/ImagePickerButton.styles";

/**
 * Composant pour sélectionner/afficher/supprimer une image
 * @param {Object} props
 * @param {string|null} props.imageUri - URI de l'image actuelle
 * @param {Function} props.onPickImage - Callback lors de la sélection d'une image
 * @param {Function} props.onRemoveImage - Callback lors de la suppression de l'image
 * @param {boolean} props.disabled - Désactive les interactions
 * @param {boolean} props.loading - Affiche un spinner
 */
export default function ImagePickerButton({
  imageUri,
  onPickImage,
  onRemoveImage,
  disabled = false,
  loading = false,
}) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);

  // Si une image est sélectionnée, afficher l'aperçu
  if (imageUri) {
    return (
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />

        {/* Bouton de suppression */}
        <Pressable
          style={styles.removeButton}
          onPress={onRemoveImage}
          disabled={disabled || loading}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </Pressable>
      </View>
    );
  }
}
