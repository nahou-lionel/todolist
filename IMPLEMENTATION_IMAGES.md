# Implémentation de la fonctionnalité d'ajout d'images aux todos

## Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs d'attacher une image optionnelle à chaque todo. Les images sont **stockées localement** sur l'appareil car l'API GraphQL backend ne supporte pas encore les images.

## Architecture de la solution

### 1. Stockage des données

#### a) Fichiers images physiques
- **Emplacement** : `FileSystem.documentDirectory/todo-images/`
- **Format** : Copie des images depuis la galerie vers ce répertoire privé
- **Nommage** : `todo_<timestamp>_<random>.jpg`
- **Gestion** : Service dédié `imageStorageService.js`

#### b) Associations todo ↔ image
- **Stockage** : AsyncStorage avec la clé `"TODO_IMAGES"`
- **Format** : Objet JSON mappant l'ID du todo avec l'URI de son image
```json
{
  "todo-id-1": "file:///path/to/app/todo-images/todo_1234567890_1234.jpg",
  "todo-id-2": "file:///path/to/app/todo-images/todo_9876543210_5678.jpg"
}
```

### 2. Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                   CRÉATION D'UN TODO AVEC IMAGE                 │
└─────────────────────────────────────────────────────────────────┘

1. Utilisateur saisit le texte du todo
2. Utilisateur clique sur "Ajouter une image"
   └─> useImagePicker.pickImage() ouvre la galerie
   └─> Sélection d'une image
   └─> L'URI de l'image est stockée dans selectedImage (state)
3. Utilisateur clique sur "Ajouter"
   └─> handleCreateTodo() est appelé
   └─> createTodo() envoie le texte à l'API GraphQL
   └─> API retourne le todo avec son ID
   └─> saveImageLocally() copie l'image dans le répertoire de l'app
   └─> L'association todo.id → imageUri est ajoutée à todoImages (state)
   └─> todoImages est automatiquement sauvegardé dans AsyncStorage
```

```
┌─────────────────────────────────────────────────────────────────┐
│                   AFFICHAGE DES TODOS                           │
└─────────────────────────────────────────────────────────────────┘

1. Au chargement du composant TodoListDetails :
   └─> AsyncStorage charge les associations todoImages
2. L'API GraphQL retourne les todos (texte uniquement)
3. Dans le FlatList, chaque TodoItem reçoit :
   └─> item={{ ...todo, imageUri: todoImages[todo.id] }}
4. TodoItem affiche l'image si imageUri existe
```

```
┌─────────────────────────────────────────────────────────────────┐
│                   SUPPRESSION D'UN TODO                         │
└─────────────────────────────────────────────────────────────────┘

1. Utilisateur clique sur supprimer
2. handleDeleteTodo() vérifie si todoImages[todoId] existe
   └─> Si oui : deleteImageLocally() supprime le fichier image
   └─> L'association est retirée de todoImages (state)
3. deleteTodo() supprime le todo de l'API
4. Le todo est retiré de la liste
```

---

## Fichiers créés

### 1. `services/imageStorageService.js`
**Rôle** : Gestion du stockage local des fichiers images

**Fonctions principales :**
- `saveImageLocally(sourceUri)` : Copie une image de la galerie vers le répertoire de l'app
- `deleteImageLocally(imageUri)` : Supprime un fichier image
- `imageExists(imageUri)` : Vérifie si une image existe
- `cleanupOrphanedImages(usedImageUris)` : Nettoie les images non utilisées

**Détails techniques :**
```javascript
const IMAGES_DIR = `${FileSystem.documentDirectory}todo-images/`;

// Génère un nom unique
const generateUniqueFilename = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `todo_${timestamp}_${random}.jpg`;
};

// Copie l'image
await FileSystem.copyAsync({
  from: sourceUri,        // URI depuis la galerie
  to: destinationUri,     // URI dans notre app
});
```

### 2. `hooks/useImagePicker.js`
**Rôle** : Hook personnalisé pour la sélection d'images depuis la galerie

**État géré :**
- `selectedImage` : URI de l'image sélectionnée
- `isLoading` : Indicateur de chargement

**Fonctions exposées :**
- `pickImage()` : Ouvre le sélecteur d'images
- `clearImage()` : Efface l'image sélectionnée

**Détails techniques :**
```javascript
// Demande la permission d'accès à la galerie
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

// Ouvre le sélecteur
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,  // Compression pour économiser l'espace
});
```

### 3. `components/UI/ImagePickerButton.js`
**Rôle** : Composant UI pour ajouter/supprimer une image

**Deux modes d'affichage :**

**Mode 1 : Pas d'image sélectionnée**
```
┌──────────────────────────────┐
│  📷  Ajouter une image       │
└──────────────────────────────┘
```

**Mode 2 : Image sélectionnée**
```
┌──────────────────────────────┐
│                              │
│     [Aperçu de l'image]      │  ← Image affichée
│                          ✕   │  ← Bouton supprimer
└──────────────────────────────┘
```

**Props :**
- `imageUri` : URI de l'image actuelle
- `onPickImage` : Callback pour sélectionner une image
- `onRemoveImage` : Callback pour supprimer l'image
- `disabled` : Désactive les interactions
- `loading` : Affiche un spinner

### 4. `styles/ImagePickerButton.styles.js`
**Rôle** : Styles pour le composant ImagePickerButton

**Styles principaux :**
- `imagePreviewContainer` : Conteneur de l'aperçu (200px de hauteur)
- `imagePreview` : Image en mode cover
- `removeButton` : Bouton X en haut à droite (overlay)
- `addButtonCompact` : Bouton compact pour ajouter une image

---

## Fichiers modifiés

### 1. `components/TodoListDetails.js`

**Imports ajoutés :**
```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useImagePicker } from "../hooks/useImagePicker";
import { saveImageLocally, deleteImageLocally } from "../services/imageStorageService";
import ImagePickerButton from "./UI/ImagePickerButton";
```

**États ajoutés :**
```javascript
// Hook pour la sélection d'images
const { pickImage, selectedImage, clearImage, isLoading: imageLoading } = useImagePicker();

// State pour stocker les associations todo <-> image
const [todoImages, setTodoImages] = useState({});
```

**useEffect pour charger les images depuis AsyncStorage :**
```javascript
useEffect(() => {
  const loadTodoImages = async () => {
    const storedImages = await AsyncStorage.getItem(TODO_IMAGES_STORAGE_KEY);
    if (storedImages) {
      setTodoImages(JSON.parse(storedImages));
    }
  };
  loadTodoImages();
}, []);
```

**useEffect pour sauvegarder les images dans AsyncStorage :**
```javascript
useEffect(() => {
  const saveTodoImages = async () => {
    await AsyncStorage.setItem(TODO_IMAGES_STORAGE_KEY, JSON.stringify(todoImages));
  };
  if (Object.keys(todoImages).length > 0) {
    saveTodoImages();
  }
}, [todoImages]); // Se déclenche à chaque changement de todoImages
```

**handleCreateTodo modifié :**
```javascript
const handleCreateTodo = async () => {
  // 1. Créer le todo (API)
  const newTodo = await createTodo(token, route.params.id, newTodoContent.trim());

  // 2. Si une image est sélectionnée, la sauvegarder
  if (selectedImage) {
    const savedImageUri = await saveImageLocally(selectedImage);
    // Associer l'image au todo
    setTodoImages(prev => ({
      ...prev,
      [newTodo.id]: savedImageUri
    }));
  }

  // 3. Réinitialiser
  setTodos([...todos, newTodo]);
  setNewTodoContent("");
  clearImage();
};
```

**handleDeleteTodo modifié :**
```javascript
const handleDeleteTodo = async (todoId) => {
  // 1. Supprimer l'image si elle existe
  if (todoImages[todoId]) {
    await deleteImageLocally(todoImages[todoId]);
    setTodoImages(prev => {
      const newImages = { ...prev };
      delete newImages[todoId];
      return newImages;
    });
  }

  // 2. Supprimer le todo (API)
  await deleteTodo(token, todoId);
  setTodos(todos.filter((todo) => todo.id !== todoId));
};
```

**Rendu modifié :**
```javascript
// En-tête avec titre + bouton export
<View style={styles.header}>
  <Text style={styles.title}>Détails de la liste</Text>
  <ExportButton ... />
</View>

// Input pour le texte
<Input ... />

// Bouton pour ajouter une image
<ImagePickerButton
  imageUri={selectedImage}
  onPickImage={pickImage}
  onRemoveImage={clearImage}
/>

// Liste des todos avec images
<FlatList
  data={todos}
  renderItem={({ item }) => (
    <TodoItem
      item={{ ...item, imageUri: todoImages[item.id] }}  // ← Injection de l'imageUri
      ...
    />
  )}
/>
```

### 2. `components/UI/TodoItem.js`

**Import ajouté :**
```javascript
import { Image } from "react-native";
```

**Structure modifiée :**
```javascript
// Avant : Layout horizontal simple
<View style={styles.container}>
  <Checkbox />
  <Text>Contenu</Text>
  <Actions />
</View>

// Après : Layout vertical avec image
<View style={styles.container}>           // ← Maintenant en colonne
  <View style={styles.mainRow}>           // ← Ligne principale
    <Checkbox />
    <Text>Contenu</Text>
    <Actions />
  </View>

  {item.imageUri && !isEditing && (       // ← Image affichée si existe
    <Image source={{ uri: item.imageUri }} style={styles.todoImage} />
  )}
</View>
```

**Styles ajoutés :**
```javascript
container: {
  flexDirection: "column",  // ← Vertical au lieu d'horizontal
  ...
},
mainRow: {
  flexDirection: "row",     // ← Ligne pour checkbox + texte + actions
  alignItems: "center",
},
todoImage: {
  width: "100%",
  height: 150,
  borderRadius: 8,
  marginTop: spacing.sm,
  resizeMode: "cover",
},
```

### 3. `styles/TodoListDetailsScreen.styles.js`

**Styles ajoutés pour la nouvelle disposition :**
```javascript
header: {
  flexDirection: "row",
  justifyContent: "space-between",  // Titre à gauche, export à droite
  alignItems: "center",
  marginBottom: spacing.lg,
},
title: {
  ...commonStyles.title,
  marginBottom: 0,  // Reset car géré par header
},
actionButtons: {
  marginBottom: spacing.lg,
},
```

### 4. `components/UI/ExportButton.js`

**Import ajouté :**
```javascript
import { MaterialIcons } from "@expo/vector-icons";
```

**Bouton transformé en icône :**
```javascript
// Avant : Gros bouton pleine largeur
<Pressable style={styles.exportButton}>
  <Text>Exporter la liste</Text>
</Pressable>

// Après : Icône circulaire compacte
<TouchableOpacity style={styles.exportIconButton}>
  <MaterialIcons name="file-download" size={24} color={colors.primary} />
</TouchableOpacity>
```

### 5. `styles/ExportButton.styles.js`

**Style remplacé :**
```javascript
// Avant : Gros bouton
exportButton: {
  height: 56,
  paddingHorizontal: spacing.lg,
  marginVertical: spacing.md,
  ...
}

// Après : Icône circulaire
exportIconButton: {
  width: 40,
  height: 40,
  borderRadius: 20,  // Cercle
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: colors.border,
}
```

---

## Packages installés

### 1. `expo-image-picker`
**Version** : Installée via npm
**Utilisation** : Sélection d'images depuis la galerie
**Documentation** : https://docs.expo.dev/versions/latest/sdk/imagepicker/

**Fonctions utilisées :**
- `requestMediaLibraryPermissionsAsync()` : Demande la permission
- `launchImageLibraryAsync()` : Ouvre le sélecteur d'images

### 2. `@react-native-async-storage/async-storage`
**Version** : Installée via npm
**Utilisation** : Persistance des associations todo ↔ image
**Documentation** : https://react-native-async-storage.github.io/async-storage/

**Fonctions utilisées :**
- `AsyncStorage.getItem(key)` : Récupère une valeur
- `AsyncStorage.setItem(key, value)` : Stocke une valeur

### 3. `expo-file-system` (déjà installé)
**Utilisation** : Gestion des fichiers images
**Documentation** : https://docs.expo.dev/versions/latest/sdk/filesystem/

**Fonctions utilisées :**
- `FileSystem.documentDirectory` : Répertoire des documents de l'app
- `FileSystem.copyAsync()` : Copie un fichier
- `FileSystem.deleteAsync()` : Supprime un fichier
- `FileSystem.getInfoAsync()` : Vérifie l'existence d'un fichier
- `FileSystem.makeDirectoryAsync()` : Crée un répertoire

---

## Limitations de la solution actuelle

### ❌ Pas de synchronisation serveur
- Les images ne sont **pas envoyées** à l'API GraphQL
- Raison : Le schéma GraphQL ne supporte pas les images (pas de champ `imageUrl` dans le type `Todo`)
- Conséquence : Les images ne sont pas partagées entre appareils

### ❌ Stockage local uniquement
- Les images sont stockées dans le répertoire de l'application
- Elles sont **perdues** si l'application est désinstallée
- Elles ne sont **pas sauvegardées** dans le cloud

### ✅ Persistance entre redémarrages
- Les associations todo ↔ image sont sauvegardées dans AsyncStorage
- Les fichiers images restent dans `documentDirectory`
- L'app se souvient des images après redémarrage

---

## Évolution future possible

### Option 1 : Modifier l'API backend
1. Ajouter un champ `imageUrl` au type GraphQL `Todo`
2. Implémenter un système d'upload d'images (ex: AWS S3, Cloudinary)
3. Modifier les mutations `createTodo` et `updateTodo` pour accepter une URL d'image
4. Dans l'app : uploader l'image puis envoyer l'URL à l'API

### Option 2 : Service cloud externe
1. Utiliser un service gratuit comme ImgBB ou Cloudinary
2. Uploader l'image lors de la création du todo
3. Stocker l'URL retournée dans le champ `content` du todo
4. Parser le `content` pour extraire l'URL lors de l'affichage

### Option 3 : Base64 (non recommandé)
1. Convertir l'image en base64
2. Stocker le base64 dans le champ `content`
3. Problème : Taille très importante, surcharge de l'API

---

## Diagramme de l'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TodoListDetails                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  State Local                                          │     │
│  │  - todos (depuis API GraphQL)                         │     │
│  │  - todoImages { todoId: imageUri }                    │     │
│  │  - selectedImage (image en cours de sélection)        │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  UI                                                   │     │
│  │  - Input (texte du todo)                              │     │
│  │  - ImagePickerButton (sélection image)                │     │
│  │  - FlatList → TodoItem (affichage avec image)         │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
           ↓                          ↓                    ↓
           ↓                          ↓                    ↓
    ┌──────────┐            ┌──────────────┐      ┌──────────────┐
    │   API    │            │ AsyncStorage │      │  FileSystem  │
    │ GraphQL  │            │              │      │              │
    │          │            │ TODO_IMAGES  │      │ /todo-images/│
    │ - todos  │            │ { id: uri }  │      │  *.jpg       │
    │ (texte)  │            │              │      │              │
    └──────────┘            └──────────────┘      └──────────────┘
```

---

## Comment tester la fonctionnalité

1. **Lancer l'application**
   ```bash
   npm start
   ```

2. **Créer un todo avec image**
   - Aller dans une liste de todos
   - Saisir le texte du todo
   - Cliquer sur "📷 Ajouter une image"
   - Sélectionner une image dans la galerie
   - Cliquer sur "Ajouter"
   - ✅ Le todo apparaît avec l'image en dessous

3. **Vérifier la persistance**
   - Fermer complètement l'application
   - Redémarrer l'application
   - ✅ L'image du todo est toujours là

4. **Supprimer un todo avec image**
   - Cliquer sur supprimer
   - ✅ Le todo ET son image sont supprimés

---

## Résumé technique

| Aspect | Solution |
|--------|----------|
| **Sélection d'images** | `expo-image-picker` |
| **Stockage fichiers** | `expo-file-system` (documentDirectory) |
| **Persistance associations** | `@react-native-async-storage/async-storage` |
| **Hook personnalisé** | `useImagePicker` |
| **Service de stockage** | `imageStorageService.js` |
| **Composant UI** | `ImagePickerButton.js` |
| **Affichage** | `TodoItem.js` (Image en dessous du texte) |
| **Synchronisation serveur** | ❌ Non (limitation API) |
| **Persistance locale** | ✅ Oui (AsyncStorage + FileSystem) |

---

**Date de création** : 20 janvier 2025
**Auteur** : Claude Code
**Version** : 1.0
