# API Mock System

Ce dossier contient le système de mock pour l'API GraphQL, vous permettant de développer l'application sans accès au réseau de l'université.

## Configuration

### Basculer entre Mock et API Réelle

Ouvrez le fichier `api/config.js` et modifiez `USE_MOCK_API` :

```javascript
export const API_CONFIG = {
  USE_MOCK_API: true,  // true = mode mock, false = API réelle
  REAL_API_URL: 'http://graphql.unicaen.fr:4000',
  MOCK_DELAY: 500 // Délai réseau simulé en ms
}
```

## Mode Mock

### Comptes de test disponibles

Le système mock inclut deux comptes de test :

1. **Compte démo**
   - Username: `demo`
   - Password: `demo123`
   - Contient 2 listes avec des todos

2. **Compte test**
   - Username: `test`
   - Password: `test123`
   - Compte vide, idéal pour tester les fonctionnalités

### Créer de nouveaux comptes

Vous pouvez créer de nouveaux comptes via l'écran SignUp. Les données sont stockées en mémoire pendant la session de développement.

### Données initiales

Le compte `demo` contient :
- **Liste "Courses"**
  - Acheter du lait (non fait)
  - Acheter du pain (fait)

- **Liste "Projet React"**
  - Créer le système de mock (fait)
  - Finaliser l'interface (non fait)

## Structure des fichiers

- **config.js** : Configuration globale (mode mock/réel)
- **mockData.js** : Base de données simulée en mémoire
- **mockService.js** : Implémentation du service mock avec simulation réseau
- **apiService.js** : Service unifié qui bascule entre mock et API réelle
- **README.md** : Cette documentation

## Utilisation dans les composants

### Import

```javascript
import {
  signIn,
  signUp,
  getTodoLists,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from '../api/apiService'
```

Ou via les fichiers dans `components/` :

```javascript
import { signIn } from '../components/SignIn'
import { getTodoLists, createTodoList } from '../components/TodoLists'
import { getTodos, createTodo } from '../components/Todos'
```

### Exemples d'utilisation

#### Authentification

```javascript
// Sign In
try {
  const token = await signIn('demo', 'demo123')
  // Token reçu, utilisateur connecté
} catch (error) {
  console.error('Erreur:', error.message)
}

// Sign Up
try {
  const token = await signUp('nouveauUser', 'password123')
  // Compte créé et token reçu
} catch (error) {
  console.error('Erreur:', error.message)
}
```

#### Gestion des listes

```javascript
// Récupérer les listes
const lists = await getTodoLists(token)

// Créer une liste
const result = await createTodoList(token, 'Ma nouvelle liste')
const newList = result.todoLists[0]

// Modifier une liste
const result = await updateTodoList(token, listId, 'Titre modifié')

// Supprimer une liste
const result = await deleteTodoList(token, listId)
```

#### Gestion des todos

```javascript
// Récupérer les todos d'une liste
const todos = await getTodos(token, todoListId)

// Créer un todo
const result = await createTodo(token, todoListId, 'Nouvelle tâche', false)
const newTodo = result.todos[0]

// Modifier un todo
const result = await updateTodo(token, todoId, {
  content: 'Tâche modifiée',
  done: true
})

// Supprimer un todo
const result = await deleteTodo(token, todoId)
```

## Gestion des erreurs

Les erreurs sont retournées au format GraphQL standard :

```javascript
{
  message: "Message d'erreur",
  extensions: {
    code: "ERROR_CODE" // BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, etc.
  }
}
```

Exemple de gestion :

```javascript
try {
  const token = await signIn(username, password)
  setToken(token)
} catch (error) {
  if (error.extensions?.code === 'UNAUTHORIZED') {
    setError('Identifiants incorrects')
  } else {
    setError(error.message)
  }
}
```

## Réinitialiser les données mock

Si vous souhaitez réinitialiser les données mock à leur état initial, vous pouvez utiliser :

```javascript
import { MockDataStore } from './api/mockData'

MockDataStore.reset()
```

## Migration vers l'API réelle

Lorsque vous avez accès au réseau de l'université :

1. Ouvrez `api/config.js`
2. Changez `USE_MOCK_API` à `false`
3. Aucun autre changement n'est nécessaire dans votre code !

Le système basculera automatiquement vers l'API réelle GraphQL.

## Notes importantes

- Les données mock sont **en mémoire uniquement** - elles sont perdues lors du rechargement de l'application
- Le délai réseau simulé (`MOCK_DELAY`) peut être ajusté dans `config.js`
- Les tokens mock suivent le format : `mock-token-{username}`
- L'authentification mock valide que les mots de passe aient au moins 6 caractères
- Les usernames doivent avoir au moins 3 caractères
