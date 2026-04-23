// Mock data store for development without API access
// This simulates a local database with users, todo lists, and todos

let nextTodoListId = 3
let nextTodoId = 5

// Mock users database
const users = [
  {
    id: '1',
    username: 'demo',
    password: 'demo123',
    token: 'mock-token-demo',
    roles: ['user']
  },
  {
    id: '2',
    username: 'test',
    password: 'test123',
    token: 'mock-token-test',
    roles: ['user']
  }
]

// Mock todo lists database
const todoLists = [
  {
    id: '1',
    title: 'Courses',
    ownerId: '1'
  },
  {
    id: '2',
    title: 'Projet React',
    ownerId: '1'
  }
]

// Mock todos database
const todos = [
  {
    id: '1',
    content: 'Acheter du lait',
    done: false,
    belongsToId: '1'
  },
  {
    id: '2',
    content: 'Acheter du pain',
    done: true,
    belongsToId: '1'
  },
  {
    id: '3',
    content: 'Créer le système de mock',
    done: true,
    belongsToId: '2'
  },
  {
    id: '4',
    content: 'Finaliser l\'interface',
    done: false,
    belongsToId: '2'
  }
]

// Helper functions to manage mock data

export const MockDataStore = {
  // User operations
  findUserByUsername: (username) => {
    return users.find(u => u.username === username)
  },

  findUserByToken: (token) => {
    return users.find(u => u.token === token)
  },

  createUser: (username, password) => {
    const newUser = {
      id: String(users.length + 1),
      username,
      password,
      token: `mock-token-${username}`,
      roles: ['user']
    }
    users.push(newUser)
    return newUser
  },

  deleteUser: (userId) => {
    const index = users.findIndex(u => u.id === userId)
    if (index > -1) {
      users.splice(index, 1)
      // Delete all todo lists and todos for this user
      const userTodoLists = todoLists.filter(tl => tl.ownerId === userId)
      userTodoLists.forEach(tl => {
        MockDataStore.deleteTodoList(tl.id)
      })
      return true
    }
    return false
  },

  deleteUserAccount: (username) => {
    const user = users.find(u => u.username === username)
    if (user) {
      return MockDataStore.deleteUser(user.id)
    }
    return false
  },

  // TodoList operations
  getTodoLists: (ownerId) => {
    return todoLists.filter(tl => tl.ownerId === ownerId)
  },

  getTodoListById: (id) => {
    return todoLists.find(tl => tl.id === id)
  },

  createTodoList: (title, ownerId) => {
    const newTodoList = {
      id: String(nextTodoListId++),
      title,
      ownerId
    }
    todoLists.push(newTodoList)
    return newTodoList
  },

  updateTodoList: (id, title) => {
    const todoList = todoLists.find(tl => tl.id === id)
    if (todoList) {
      todoList.title = title
      return todoList
    }
    return null
  },

  deleteTodoList: (id) => {
    const index = todoLists.findIndex(tl => tl.id === id)
    if (index > -1) {
      todoLists.splice(index, 1)
      // Delete all todos in this list
      const todosToDelete = todos.filter(t => t.belongsToId === id)
      todosToDelete.forEach(t => {
        const todoIndex = todos.findIndex(todo => todo.id === t.id)
        if (todoIndex > -1) {
          todos.splice(todoIndex, 1)
        }
      })
      return true
    }
    return false
  },

  // Todo operations
  getTodos: (todoListId) => {
    return todos.filter(t => t.belongsToId === todoListId)
  },

  getTodoById: (id) => {
    return todos.find(t => t.id === id)
  },

  createTodo: (content, belongsToId, done = false) => {
    const newTodo = {
      id: String(nextTodoId++),
      content,
      done,
      belongsToId
    }
    todos.push(newTodo)
    return newTodo
  },

  updateTodo: (id, updates) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      if (updates.content !== undefined) todo.content = updates.content
      if (updates.done !== undefined) todo.done = updates.done
      return todo
    }
    return null
  },

  deleteTodo: (id) => {
    const index = todos.findIndex(t => t.id === id)
    if (index > -1) {
      todos.splice(index, 1)
      return true
    }
    return false
  },

  // Reset to initial state (useful for testing)
  reset: () => {
    users.length = 0
    todoLists.length = 0
    todos.length = 0
    nextTodoListId = 3
    nextTodoId = 5

    // Restore initial data
    users.push(
      { id: '1', username: 'demo', password: 'demo123', token: 'mock-token-demo', roles: ['user'] },
      { id: '2', username: 'test', password: 'test123', token: 'mock-token-test', roles: ['user'] }
    )
    todoLists.push(
      { id: '1', title: 'Courses', ownerId: '1' },
      { id: '2', title: 'Projet React', ownerId: '1' }
    )
    todos.push(
      { id: '1', content: 'Acheter du lait', done: false, belongsToId: '1' },
      { id: '2', content: 'Acheter du pain', done: true, belongsToId: '1' },
      { id: '3', content: 'Créer le système de mock', done: true, belongsToId: '2' },
      { id: '4', content: 'Finaliser l\'interface', done: false, belongsToId: '2' }
    )
  }
}
