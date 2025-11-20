# Guide d'Implémentation - Service d'Export

Ce guide vous explique comment implémenter le service d'export pour partager vos listes de tâches dans différents formats.

## 📋 Vue d'ensemble

Le service d'export permet d'exporter une liste de tâches dans 3 formats :
- **JSON** : Format structuré pour réimporter les données
- **CSV** : Compatible avec Excel et Google Sheets
- **Texte simple** : Format universel facile à partager

## 🔧 Étape 1 : Installation des dépendances

Installez les packages nécessaires pour gérer les fichiers et le partage :

```bash
npm install expo-sharing expo-file-system
```

Ces packages permettent :
- `expo-file-system` : Créer et écrire des fichiers temporaires
- `expo-sharing` : Partager les fichiers via le système natif (email, messagerie, etc.)

## 📁 Étape 2 : Créer le service d'export

Créez le fichier `services/exportService.js` avec les fonctions suivantes :

### Structure du fichier

```javascript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
```

### Fonction 1 : Export au format JSON

```javascript
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
    completedTodos: todos.filter(t => t.done).length,
    todos: todos.map(todo => ({
      id: todo.id,
      content: todo.content,
      done: todo.done,
      createdAt: todo.createdAt || null
    }))
  };

  // TODO: Convertir en JSON avec indentation (2 espaces)
  return JSON.stringify(data, null, 2);
};
```

**À implémenter :**
- Créer un objet contenant toutes les informations de la liste
- Inclure les métadonnées (date d'export, statistiques)
- Retourner une chaîne JSON bien formatée

### Fonction 2 : Export au format CSV

```javascript
/**
 * Exporte une liste au format CSV
 * @param {string} listTitle - Titre de la liste
 * @param {Array} todos - Tableau des tâches
 * @returns {string} - Contenu CSV
 */
const exportToCSV = (listTitle, todos) => {
  // TODO: Créer la ligne d'en-têtes
  const headers = 'Statut,Contenu,Date de création\n';

  // TODO: Créer les lignes de données
  const rows = todos.map(todo => {
    const status = todo.done ? 'Terminé' : 'En cours';
    // Échapper les guillemets dans le contenu
    const content = `"${todo.content.replace(/"/g, '""')}"`;
    const date = todo.createdAt
      ? new Date(todo.createdAt).toLocaleDateString('fr-FR')
      : 'N/A';
    return `${status},${content},${date}`;
  }).join('\n');

  return headers + rows;
};
```

**À implémenter :**
- Créer la ligne d'en-têtes CSV
- Formater chaque tâche en ligne CSV
- Échapper les guillemets dans le contenu (important !)
- Gérer les dates au format français

### Fonction 3 : Export au format Texte

```javascript
/**
 * Exporte une liste au format texte simple
 * @param {string} listTitle - Titre de la liste
 * @param {Array} todos - Tableau des tâches
 * @returns {string} - Contenu texte formaté
 */
const exportToText = (listTitle, todos) => {
  // TODO: Calculer les statistiques
  const completedCount = todos.filter(t => t.done).length;
  const totalCount = todos.length;
  const percentage = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  // TODO: Construire le texte formaté
  let text = `${listTitle}\n`;
  text += `${'='.repeat(listTitle.length)}\n\n`;
  text += `Exporté le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`;
  text += `Progression : ${completedCount}/${totalCount} tâches (${percentage}%)\n\n`;

  if (todos.length === 0) {
    text += 'Aucune tâche dans cette liste.\n';
  } else {
    text += 'TÂCHES :\n';
    text += '---------\n\n';

    todos.forEach((todo, index) => {
      const checkbox = todo.done ? '[✓]' : '[ ]';
      text += `${index + 1}. ${checkbox} ${todo.content}\n`;
    });
  }

  return text;
};
```

**À implémenter :**
- Créer un en-tête avec titre souligné
- Afficher les statistiques de progression
- Lister les tâches avec des checkboxes (✓ ou vide)
- Numéroter les tâches

### Fonction 4 : Sauvegarde et partage

```javascript
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
      throw new Error('Le partage de fichiers n\'est pas disponible sur cet appareil');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw error;
  }
};
```

**À implémenter :**
- Créer un fichier temporaire dans le cache
- Écrire le contenu au format UTF-8
- Vérifier la disponibilité du partage
- Ouvrir la fenêtre de partage système

### Fonctions utilitaires

```javascript
/**
 * Retourne le type MIME approprié pour le format
 */
const getMimeType = (format) => {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'text':
      return 'text/plain';
    default:
      return 'text/plain';
  }
};

/**
 * Retourne l'UTI (Uniform Type Identifier) pour iOS
 */
const getUTI = (format) => {
  switch (format) {
    case 'json':
      return 'public.json';
    case 'csv':
      return 'public.comma-separated-values-text';
    case 'text':
      return 'public.plain-text';
    default:
      return 'public.plain-text';
  }
};

/**
 * Génère un nom de fichier sécurisé
 */
const generateFilename = (title, format) => {
  // Nettoyer le titre (enlever caractères spéciaux)
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const timestamp = new Date().getTime();
  const extension = format === 'text' ? 'txt' : format;

  return `${sanitizedTitle}-${timestamp}.${extension}`;
};
```

### Fonction principale d'export

```javascript
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
      case 'json':
        content = exportToJSON(listTitle, todos);
        break;
      case 'csv':
        content = exportToCSV(listTitle, todos);
        break;
      case 'text':
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
    console.error('Erreur lors de l\'export:', error);
    throw error;
  }
};
```

## 🎨 Étape 3 : Intégrer dans TodoListDetails

Modifiez le fichier `components/TodoListDetails.js` :

```javascript
// 1. Importer le composant et le service
import ExportButton from './UI/ExportButton';
import { exportTodoList } from '../services/exportService';

// 2. Ajouter la fonction de gestion de l'export
const handleExport = async (listTitle, todos, format) => {
  await exportTodoList(listTitle, todos, format);
};

// 3. Ajouter le bouton dans le JSX (après le Input, avant la FlatList)
<ExportButton
  listTitle={route.params.title}
  todos={todos}
  onExport={handleExport}
/>
```

### Emplacement du bouton

```jsx
return (
  <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Détails de la liste</Text>

      <Input
        value={newTodoContent}
        onChangeText={setNewTodoContent}
        onSubmit={handleCreateTodo}
        placeholder="Nouveau todo..."
        submitLabel="Ajouter"
        loading={creating}
        style={styles.createSection}
      />

      {/* 👇 AJOUTER LE BOUTON ICI */}
      <ExportButton
        listTitle={route.params.title}
        todos={todos}
        onExport={handleExport}
      />

      {todos.length === 0 ? (
        <Text style={styles.subtitle}>Aucun todo pour le moment</Text>
      ) : (
        <FlatList
          data={todos}
          // ...
        />
      )}
    </View>
  </View>
);
```

## ✅ Checklist d'implémentation

- [ ] Installer `expo-sharing` et `expo-file-system`
- [ ] Créer le dossier `services/` à la racine du projet
- [ ] Créer `services/exportService.js`
- [ ] Implémenter `exportToJSON()`
- [ ] Implémenter `exportToCSV()`
- [ ] Implémenter `exportToText()`
- [ ] Implémenter `saveAndShare()`
- [ ] Implémenter les fonctions utilitaires
- [ ] Implémenter `exportTodoList()` (fonction principale)
- [ ] Modifier `components/TodoListDetails.js`
- [ ] Importer ExportButton et exportTodoList
- [ ] Ajouter la fonction `handleExport`
- [ ] Ajouter le composant ExportButton dans le JSX
- [ ] Tester l'export en JSON
- [ ] Tester l'export en CSV
- [ ] Tester l'export en texte simple
- [ ] Vérifier le partage (email, messages, etc.)

## 🧪 Tests à effectuer

1. **Export JSON** :
   - Vérifier que le fichier contient toutes les données
   - Vérifier le format JSON (indentation correcte)
   - Tester avec une liste vide

2. **Export CSV** :
   - Ouvrir dans Excel ou Google Sheets
   - Vérifier que les guillemets sont bien échappés
   - Tester avec des tâches contenant des virgules et guillemets

3. **Export Texte** :
   - Vérifier la mise en forme
   - Vérifier les statistiques de progression
   - Vérifier les checkboxes (✓)

4. **Partage** :
   - Tester le partage par email
   - Tester le partage par message
   - Tester la sauvegarde dans les fichiers

## 🐛 Gestion des erreurs communes

### Erreur : "Sharing is not available"
- Le partage peut ne pas être disponible sur certains émulateurs
- Tester sur un appareil réel

### Erreur : Caractères mal encodés
- Vérifier que l'encodage UTF-8 est bien utilisé
- Tester avec des accents et caractères spéciaux

### Erreur : Fichier non trouvé
- Vérifier que `FileSystem.cacheDirectory` est bien défini
- Vérifier les permissions de l'app

## 📚 Ressources

- [Documentation expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Documentation expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [Format CSV RFC 4180](https://tools.ietf.org/html/rfc4180)

## 💡 Améliorations possibles

Une fois l'implémentation de base fonctionnelle, vous pourrez ajouter :

- Export de toutes les listes en un seul fichier
- Import de fichiers JSON pour restaurer des listes
- Export au format PDF
- Synchronisation cloud (Google Drive, Dropbox)
- Planification d'exports automatiques
- Envoi par email directement depuis l'app
