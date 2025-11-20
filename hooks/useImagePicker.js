import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Platform } from "react-native";

/**
 * Hook personnalisé pour gérer la sélection d'images depuis la galerie
 * @returns {Object} { pickImage, selectedImage, clearImage, isLoading }
 */
export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Demande la permission d'accéder à la galerie
   * @returns {Promise<boolean>}
   */
  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la galerie est nécessaire pour ajouter des images."
        );
        return false;
      }
    }
    return true;
  };

  /**
   * Ouvre le sélecteur d'images
   * @returns {Promise<string|null>} URI de l'image sélectionnée ou null
   */
  const pickImage = async () => {
    try {
      setIsLoading(true);

      // Demander la permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return null;
      }

      // Lancer le sélecteur d'images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Compression pour économiser de l'espace
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        return imageUri;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection de l'image"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Efface l'image sélectionnée
   */
  const clearImage = () => {
    setSelectedImage(null);
  };

  return {
    pickImage,
    selectedImage,
    clearImage,
    isLoading,
  };
};
