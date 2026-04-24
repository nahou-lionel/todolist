# Todolist

Application mobile de gestion de tâches développée avec React Native et Expo. Communique avec une API GraphQL.

**Version de démonstration** : le mock est activé par défaut (`api/config.js`) — identifiants de test : `demo` / `demo123`.

## Fonctionnalités

- Authentification par token (inscription, connexion, suppression de compte)
- Création, modification et suppression de listes de tâches
- Gestion des items : ajout, édition inline, basculement fait/non fait, suppression
- Barre de progression et compteur par liste
- Attachement d'images depuis la galerie (stockage local)
- Export de listes en JSON, CSV ou texte avec partage système
- Modals personnalisées (compatibilité web)

## Prérequis

```bash
npm install
```

## Lancement

```bash
npm start        # Expo DevTools
npm run android  # Émulateur Android
npm run web      # Navigateur
```

## Configuration API

Par défaut, l'application utilise des données de mock. Pour pointer sur l'API réelle (réseau universitaire), modifier `api/config.js` :

```js
USE_MOCK_API: false  // Désactive le mock
```

L'URL de l'API est `http://graphql.unicaen.fr:4000`.

## Architecture

```
api/
├── apiService.js     # Switch mock / réel, fonctions exportées
├── config.js         # USE_MOCK_API, REAL_API_URL, MOCK_DELAY
├── mockData.js       # Base de données en mémoire (users, listes, todos)
└── mockService.js    # Implémentation mock des opérations GraphQL

Screen/               # Écrans principaux (SignIn, SignUp, TodoLists, Settings)
components/UI/        # Composants réutilisables (TodoListItem, TodoItem, modals)
Context/              # TokenContext, UsernameContext, AlertContext
hooks/                # useTheme, useImagePicker, useAlert
services/             # exportService (JSON/CSV/texte)
styles/               # Fichiers de styles par écran + theme.js centralisé
```

**Navigation** : Bottom Tab Navigator avec flux conditionnel selon l'authentification (token null → SignIn/SignUp, token présent → listes, détails, paramètres).

**Thème** : couleur primaire `#5886fe`, centralisé dans `styles/theme.js`, consommé via le hook `useTheme`.
