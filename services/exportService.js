import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

/**
 * Exporte une liste au format JSON
 * @param {string} listTitle - Titre de la liste
 * @param {Array} todos - Tableau des tâches
 * @returns {string} - Contenu JSON formaté
 */
const exportToJSON = (listTitle, todos) => {
  // TODO: Créer un objet avec les données de la liste
  const data = {
    title: listTitle,
    exportDate: new Date().toISOString(),
    totalTodos: todos.length,
    completedTodos: todos.filter((t) => t.done).length,
    todos: todos.map((todo) => ({
      id: todo.id,
      content: todo.content,
      done: todo.done,
      createdAt: todo.createdAt || null,
    })),
  };

  // TODO: Convertir en JSON avec indentation (2 espaces)
  return JSON.stringify(data, null, 2);
};

/**
 * Exporte une liste au format CSV
 * @param {string} listTitle - Titre de la liste
 * @param {Array} todos - Tableau des tâches
 * @returns {string} - Contenu CSV
 */
const exportToCSV = (listTitle, todos) => {
  // TODO: Créer la ligne d'en-têtes
  const headers = "Statut,Contenu,Date de création\n";

  // TODO: Créer les lignes de données
  const rows = todos
    .map((todo) => {
      const status = todo.done ? "Terminé" : "En cours";
      // Échapper les guillemets dans le contenu
      const content = `"${todo.content.replace(/"/g, '""')}"`;
      const date = todo.createdAt
        ? new Date(todo.createdAt).toLocaleDateString("fr-FR")
        : "N/A";
      return `${status},${content},${date}`;
    })
    .join("\n");

  return headers + rows;
};

/**
 * Exporte une liste au format texte simple
 * @param {string} listTitle - Titre de la liste
 * @param {Array} todos - Tableau des tâches
 * @returns {string} - Contenu texte formaté
 */
const exportToText = (listTitle, todos) => {
  // TODO: Calculer les statistiques

  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // TODO: Construire le texte formaté
  let text = `${listTitle}\n`;
  text += `${"=".repeat(listTitle.length)}\n\n`;
  text += `Exporté le : ${new Date().toLocaleDateString(
    "fr-FR"
  )} à ${new Date().toLocaleTimeString("fr-FR")}\n`;
  text += `Progression : ${completedCount}/${totalCount} tâches (${percentage}%)\n\n`;

  if (todos.length === 0) {
    text += "Aucune tâche dans cette liste.\n";
  } else {
    text += "TÂCHES :\n";
    text += "---------\n\n";

    todos.forEach((todo, index) => {
      const checkbox = todo.done ? "[✓]" : "[ ]";
      text += `${index + 1}. ${checkbox} ${todo.content}\n`;
    });
  }

  return text;
};

/**
 * Retourne le type MIME approprié pour le format
 */
const getMimeType = (format) => {
  switch (format) {
    case "json":
      return "application/json";
    case "csv":
      return "text/csv";
    case "text":
      return "text/plain";
    default:
      return "text/plain";
  }
};

/**
 * Retourne l'UTI (Uniform Type Identifier) pour iOS
 */
const getUTI = (format) => {
  switch (format) {
    case "json":
      return "public.json";
    case "csv":
      return "public.comma-separated-values-text";
    case "text":
      return "public.plain-text";
    default:
      return "public.plain-text";
  }
};

/**
 * Génère un nom de fichier sécurisé
 */
const generateFilename = (title, format) => {
  // Nettoyer le titre (enlever caractères spéciaux)
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const timestamp = new Date().getTime();
  const extension = format === "text" ? "txt" : format;

  return `${sanitizedTitle}-${timestamp}.${extension}`;
};

/**
 * Sauvegarde et partage un fichier
 * @param {string} content - Contenu du fichier
 * @param {string} filename - Nom du fichier
 * @param {string} format - Format (json, csv, text)
 */
const saveAndShare = async (content, filename, format) => {
  try {
    // TODO: 1. Créer le chemin du fichier dans le cache
    const fileUri = FileSystem.cacheDirectory + filename;

    // TODO: 2. Écrire le contenu dans le fichier
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // TODO: 3. Vérifier si le partage est disponible
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      // TODO: 4. Partager le fichier
      await Sharing.shareAsync(fileUri, {
        mimeType: getMimeType(format),
        dialogTitle: `Partager ${filename}`,
        UTI: getUTI(format), // Pour iOS
      });
    } else {
      throw new Error(
        "Le partage de fichiers n'est pas disponible sur cet appareil"
      );
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    throw error;
  }
};

/**
 * Fonction principale d'export
 * @param {string} listTitle - Titre de la liste
 * @param {Array} todos - Tableau des tâches
 * @param {string} format - Format d'export (json, csv, text)
 */
export const exportTodoList = async (listTitle, todos, format) => {
  try {
    let content;

    // TODO: Générer le contenu selon le format
    switch (format) {
      case "json":
        content = exportToJSON(listTitle, todos);
        break;
      case "csv":
        content = exportToCSV(listTitle, todos);
        break;
      case "text":
        content = exportToText(listTitle, todos);
        break;
      default:
        throw new Error(`Format non supporté: ${format}`);
    }

    // TODO: Générer le nom de fichier
    const filename = generateFilename(listTitle, format);

    // TODO: Sauvegarder et partager
    await saveAndShare(content, filename, format);

    return true;
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    throw error;
  }
};
