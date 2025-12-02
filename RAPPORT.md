# Rapport - Application de Gestion de Tâches

## Informations sur le binôme

**Étudiants :**

- Étudiant 1 : Talon Morel - 22409709
- Étudiant 2 : Nahou Lionel - 22409689

---

## Description du projet

Cette application mobile de gestion de tâches a été développée avec React Native et Expo. Elle permet aux utilisateurs de créer et gérer des listes de tâches avec une interface moderne et intuitive. L'application communique avec l'API GraphQL fournie à l'adresse http://graphql.unicaen.fr:4000.

---

## Fonctionnalités développées

### 1. Authentification

#### Inscription (SignUp)

- Formulaire d'inscription avec validation
- Vérification de la correspondance des mots de passe
- Gestion des erreurs (utilisateur existant, champs invalides)
- Enregistrement automatique du token d'authentification
- Navigation automatique vers l'application après inscription

#### Connexion (SignIn)

- Formulaire de connexion avec username et password
- Gestion des erreurs de connexion (identifiants incorrects)
- Système d'authentification par token
- Navigation conditionnelle selon l'état d'authentification

### 2. Gestion des listes de tâches

#### Affichage des listes

- Liste complète des listes de l'utilisateur connecté
- Affichage des statistiques pour chaque liste :
  - Nombre de tâches complétées / total
  - Pourcentage de progression

#### Création de listes

- Ajout de nouvelles listes via un champ de saisie intégré
- Validation des données (titre non vide)
- Feedback visuel pendant la création (loading)
- Gestion des erreurs de création

#### Modification de listes

- Édition inline du titre de la liste
- Boutons Save/Cancel pour confirmer ou annuler
- Prévention de la navigation pendant l'édition

#### Suppression de listes

- Modal de confirmation avant suppression
- Suppression de la liste et de tous ses items associés
- Gestion des erreurs avec feedback utilisateur

### 3. Gestion des items de tâches

#### Affichage des tâches

- Liste détaillée des tâches d'une liste spécifique
- Affichage du contenu et du statut (fait/non fait)
- Affichage de l'image associée le cas échéant

#### Création de tâches

- Modal dédiée pour ajouter une nouvelle tâche
- Champ de texte multi-lignes pour les descriptions longues
- Possibilité d'attacher une image (voir section Extra)
- Validation et gestion des erreurs

#### Modification de tâches

- Édition inline du contenu de la tâche
- Support du texte multi-lignes

#### Basculement du statut

- Checkbox pour marquer une tâche comme complétée/non complétée
- Effet visuel (barré, changement de couleur)
- Mise à jour instantanée de la barre de progression

#### Suppression de tâches

- Modal de confirmation avant suppression
- Suppression automatique de l'image associée
- Mise à jour des statistiques de la liste

### 4. Interactions UI

#### Barre de progression (Fonctionnalité demandée)

- Composant Progress personnalisé
- Affichage visuel du pourcentage de complétion

#### Compteurs

- Affichage "X/Y tâches" sur chaque liste
- Calcul en temps réel des statistiques
- Mise à jour automatique après chaque modification

#### Bouton d'action flottant

- Bouton Material Design pour ajouter des tâches
- Position fixe en bas à droite

#### Système de modals personnalisé

- Remplacement de Alert natif pour compatibilité web
- Modals pour confirmations, erreurs et succès

### 5. Administration utilisateur (Fonctionnalité demandée)

#### Suppression du compte

- Modal de confirmation
- Suppression complète de l'utilisateur et de ses données
- Déconnexion automatique après suppression
- Navigation vers l'écran de connexion

#### Déconnexion

- Modal de confirmation
- Effacement du token et du contexte utilisateur
- Retour à l'écran d'authentification

#### Écran des paramètres

- Affichage du profil utilisateur (username)
- Organisation par sections (Profil, Actions)

### 6. Fonctionnalités supplémentaires

#### Ajout d'images aux tâches (Fonctionnalité bonus)

**Hook useImagePicker personnalisé :**

- Utilisation de expo-image-picker
- Gestion des permissions pour accéder à la galerie

**Service de stockage d'images :**

- Stockage local dans le répertoire de l'application
- Génération de noms de fichiers uniques (timestamp + aléatoire)
- Copie des images de la galerie vers le stockage permanent
- Suppression automatique des images lors de la suppression de tâches
- Vérification d'existence et nettoyage des images orphelines

**Association image-tâche :**

- Stockage persistant avec AsyncStorage
- Mapping todoId → imageUri en JSON
- Chargement automatique au démarrage
- Sauvegarde automatique lors des modifications

#### Export et partage de listes (Fonctionnalité bonus)

**Service d'export personnalisé :**

**Format JSON :**

- Export structuré des données
- Inclut : titre, date d'export, statistiques, tableau des tâches
- Chaque tâche : id, contenu, statut, date de création

**Format CSV :**

- Compatible Excel et Google Sheets
- En-têtes : "Statut,Contenu,Date de création"
- Statut affiché : "Terminé" ou "En cours"

**Format Texte :**

- Format lisible par humain
- Statistiques de progression
- Liste avec cases à cocher ([✓] ou [ ])

**Implémentation de l'export :**

- Modal de sélection du format
- Boutons radio pour le choix
- Descriptions des formats
- Intégration avec expo-sharing pour le partage
- expo-file-system pour la création de fichiers
- Gestion des types MIME et UTI
- Feedback de succès/erreur

#### Système de thème cohérent

**Thème centralisé :**

- Palette de couleurs : primaire (#5886fe bleu), arrière-plan, texte, cartes, bordures, erreur, succès
- Échelle d'espacement : xs(8) à xxl(60)
- Tailles de police : small(12) à title(42)
- Rayons de bordure : small(8) à large(16)
- Définitions d'ombres (boutons, éléments moyens)

**Hook useTheme personnalisé :**

- Fournit colors, spacing, fontSize, borderRadius, shadows
- Utilisé dans tous les composants
- Style cohérent dans toute l'application
- Facilite les mises à jour du thème

**Organisation des styles :**

- Fichiers de styles séparés par écran/composant
- Fonctions createStyles acceptant couleurs et ombres
- StyleSheet.create pour les performances
- Styles dynamiques basés sur le thème

### 7. Intégration GraphQL

**Configuration centralisée :**

- URL de l'API : http://graphql.unicaen.fr:4000
- Service API unifié

**Service API GraphQL :**

**Requêtes d'authentification :**

```graphql
signIn(username: String!, password: String!): String
signUp(username: String!, password: String!): String
deleteUsers(where: UserWhere)
```

**Requêtes de listes :**

```graphql
todoLists(where: TodoListWhere): [TodoList]
createTodoLists(input: [TodoListCreateInput!]!)
updateTodoLists(where: {id}, update: {title})
deleteTodoLists(where: {id})
```

**Requêtes de tâches :**

```graphql
todos(where: TodoWhere): [Todo]
createTodos(input: [TodoCreateInput!]!)
updateTodos(where: {id}, update: TodoUpdateInput)
deleteTodos(where: {id})
```

**Fonctionnalités avancées :**

- Authentification par token Bearer
- Extraction des erreurs GraphQL
- Gestion des relations (TodoList → owner, Todo → belongsTo)
- Requêtes imbriquées pour les informations du propriétaire

## Architecture technique

### Navigation

- React Navigation avec Bottom Tab Navigator
- Navigation conditionnelle selon l'authentification
- Stack Navigator pour les listes et détails
- Icônes Material avec labels en français

### Gestion d'état

- React Context API (TokenContext, UsernameContext, AlertContext)
- useState pour l'état local des composants
- AsyncStorage pour la persistance (mappings d'images)

### Optimisations des performances

- FlatList avec keyExtractor
- Optimisations de rendu
- useCallback pour mémorisation des fonctions
- useFocusEffect pour rafraîchissement des données
- StyleSheet.create pour mise en cache des styles

### Organisation du code

- Dossiers séparés : Screen, components, Context, api, hooks, services, styles
- Composants UI dans components/UI
- Nommage de fichiers cohérent
- Séparation claire des responsabilités
- Composants réutilisables

### Dépendances principales

- React Native 0.72.10
- Expo 49.0.8
- @react-navigation/\* (navigation)
- @react-native-async-storage/async-storage
- expo-image-picker
- expo-file-system
- expo-sharing

---

## Points forts du projet

### Design et UX

- Interface moderne et cohérente grâce au système de thème
- Animations fluides et feedback visuel permanent
- Gestion intelligente du clavier
- Modals personnalisées pour meilleure expérience utilisateur
- Icônes Material Design pour clarté
- Palette de couleurs harmonieuse

### Qualité de l'interface utilisateur

- Composants réutilisables et modulaires
- Édition inline pour rapidité d'utilisation
- États de chargement omniprésents
- Prévention des clics parasites (event propagation)
- Bouton FAB pour accès rapide
- Layout responsive

### Gestion des erreurs API

- Extraction automatique des erreurs GraphQL
- Affichage convivial des erreurs
- Modals de confirmation pour actions destructives
- Validation avant envoi à l'API
- Messages d'erreur en français et contextuels
- Gestion des cas d'échec partiel

### Fonctionnalités supplémentaires

- Barre de progression visuelle (demandée)
- Administration utilisateur complète (demandée)
- Ajout d'images depuis la galerie (bonus)
- Export multi-format avec partage (bonus)
- Système de thème personnalisé (bonus)
- Stockage local d'images (bonus)

### Qualité du code

- Architecture claire et maintenable
- Séparation des responsabilités
- Services réutilisables (API, export, stockage)
- Hooks personnalisés (useTheme, useImagePicker, useAlert)
- Contextes pour état global
- Code commenté en français

---

## Fonctionnalités de la consigne

### Fonctionnalités de base

- ✅ Enregistrement (signUp)
- ✅ Connexion (signIn)
- ✅ Ajouter/modifier/supprimer des listes
- ✅ Ajouter/modifier/supprimer des items
- ✅ Compteur de tâches
- ✅ Affichage du statut des tâches (fait/non fait)
- ✅ Utilisation de l'API GraphQL http://graphql.unicaen.fr:4000

### Fonctionnalités non traitées en TP (demandées)

- ✅ Barre de progression indiquant le nombre de tâches réalisées/total
- ✅ Administration : supprimer les listes et leurs items
- ✅ Administration : supprimer le compte utilisateur
- ✅ Gestion des erreurs API complète

### Fonctionnalités bonus

- ✅ Ajout d'images depuis la galerie pour les items
- ✅ Export et partage de listes (JSON, CSV, Texte)
- ✅ Génération d'APK (non réalisée)

---

## Difficultés rencontrées et solutions

### Stockage des images

**Problème :** Le serveur fournit ne gère pas le stockage. Les images sont donc stockées localement. Les images sélectionnées depuis la galerie n'étaient pas accessibles après redémarrage.

**Solution :** Copie des images dans le répertoire documentDirectory de l'application avec noms uniques, et mapping persistant avec AsyncStorage.

### Synchronisation des statistiques

**Problème :** Les statistiques de progression n'étaient pas toujours à jour.

**Solution :** Utilisation de useFocusEffect pour rafraîchir les données à chaque retour sur l'écran des listes.

### Compatibilité web du composant Alert

**Problème :** Le composant Alert natif ne fonctionnait pas sur le web.

**Solution :** Création d'un AlertContext avec composant AlertModal personnalisé pour compatibilité multiplateforme.

---

## Conclusion

Cette application de gestion de tâches répond à l'ensemble des exigences du projet et va au-delà avec des fonctionnalités supplémentaires significatives. L'architecture est propre, le code est maintenable, et l'expérience utilisateur est soignée avec une attention particulière portée à la gestion des erreurs et aux feedback visuels.

Les fonctionnalités d'ajout d'images et d'export multi-format enrichissent considérablement l'application et démontrent une maîtrise des APIs Expo (image-picker, file-system, sharing) ainsi qu'une capacité à développer des fonctionnalités complexes de manière autonome.
