import * as FileSystem from "expo-file-system";

/**
 * Service de gestion du stockage local des images pour les todos
 * Les images sont copiées dans le répertoire documentDirectory de l'app
 */

const IMAGES_DIR = `${FileSystem.documentDirectory}todo-images/`;

/**
 * Initialise le répertoire d'images s'il n'existe pas
 */
const ensureImagesDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  }
};

/**
 * Génère un nom de fichier unique pour une image
 * @returns {string} Nom de fichier unique
 */
const generateUniqueFilename = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `todo_${timestamp}_${random}.jpg`;
};

/**
 * Sauvegarde une image dans le répertoire de l'app
 * @param {string} sourceUri - URI source de l'image (depuis la galerie)
 * @returns {Promise<string>} URI locale de l'image sauvegardée
 */
export const saveImageLocally = async (sourceUri) => {
  try {
    await ensureImagesDirExists();

    const filename = generateUniqueFilename();
    const destinationUri = IMAGES_DIR + filename;

    // Copier l'image depuis la galerie vers notre répertoire
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'image:", error);
    throw new Error("Impossible de sauvegarder l'image");
  }
};

/**
 * Supprime une image du stockage local
 * @param {string} imageUri - URI de l'image à supprimer
 */
export const deleteImageLocally = async (imageUri) => {
  try {
    if (!imageUri || !imageUri.startsWith(IMAGES_DIR)) {
      return; // N'est pas une image locale
    }

    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    // Ne pas throw, la suppression n'est pas critique
  }
};

/**
 * Vérifie si une image existe localement
 * @param {string} imageUri - URI de l'image
 * @returns {Promise<boolean>}
 */
export const imageExists = async (imageUri) => {
  try {
    if (!imageUri) return false;
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    return fileInfo.exists;
  } catch (error) {
    return false;
  }
};

/**
 * Nettoie les images orphelines (non utilisées par des todos)
 * @param {Array<string>} usedImageUris - Liste des URIs d'images utilisées
 */
export const cleanupOrphanedImages = async (usedImageUris) => {
  try {
    await ensureImagesDirExists();

    const files = await FileSystem.readDirectoryAsync(IMAGES_DIR);

    for (const filename of files) {
      const fileUri = IMAGES_DIR + filename;
      if (!usedImageUris.includes(fileUri)) {
        await FileSystem.deleteAsync(fileUri);
      }
    }
  } catch (error) {
    console.error("Erreur lors du nettoyage des images:", error);
  }
};
