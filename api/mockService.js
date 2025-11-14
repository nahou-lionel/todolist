// Mock API service that simulates GraphQL responses
import { MockDataStore } from './mockData'
import { API_CONFIG } from './config'

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Simulate GraphQL error format
const createError = (message, code = 'BAD_REQUEST') => {
  return {
    message,
    extensions: { code }
  }
}

export const MockAPIService = {
  // Authentication
  signIn: async (username, password) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByUsername(username)

    if (!user) {
      throw createError('User not found')
    }

    if (user.password !== password) {
      throw createError('Invalid password')
    }

    return user.token
  },

  signUp: async (username, password) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const existingUser = MockDataStore.findUserByUsername(username)

    if (existingUser) {
      throw createError('Username already exists')
    }

    if (!username || username.length < 3) {
      throw createError('Username must be at least 3 characters')
    }

    if (!password || password.length < 6) {
      throw createError('Password must be at least 6 characters')
    }

    const newUser = MockDataStore.createUser(username, password)
    return newUser.token
  },

  // User operations
  getUser: async (token) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    return {
      id: user.id,
      username: user.username,
      roles: user.roles
    }
  },

  deleteUser: async (token) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const deleted = MockDataStore.deleteUser(user.id)

    return {
      nodesDeleted: deleted ? 1 : 0,
      relationshipsDeleted: 0
    }
  },

  // TodoList operations
  getTodoLists: async (token, username) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    // Check if username matches the authenticated user
    if (user.username !== username) {
      throw createError('Not authorized to view this user\'s lists', 'FORBIDDEN')
    }

    const todoLists = MockDataStore.getTodoLists(user.id)

    return todoLists.map(tl => ({
      id: tl.id,
      title: tl.title
    }))
  },

  createTodoList: async (token, username, title) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    // Check if username matches the authenticated user
    if (user.username !== username) {
      throw createError('Not authorized to create list for this user', 'FORBIDDEN')
    }

    if (!title || title.trim().length === 0) {
      throw createError('Title is required')
    }

    const newTodoList = MockDataStore.createTodoList(title, user.id)

    return {
      id: newTodoList.id,
      title: newTodoList.title,
      owner: {
        username: user.username
      }
    }
  },

  updateTodoList: async (token, todoListId, title) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const todoList = MockDataStore.getTodoListById(todoListId)

    if (!todoList) {
      throw createError('TodoList not found')
    }

    if (todoList.ownerId !== user.id) {
      throw createError('Not authorized to update this list', 'FORBIDDEN')
    }

    const updated = MockDataStore.updateTodoList(todoListId, title)

    return {
      todoLists: [{
        id: updated.id,
        title: updated.title,
        owner: {
          id: user.id,
          username: user.username,
          roles: user.roles
        }
      }]
    }
  },

  deleteTodoList: async (token, todoListId) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const todoList = MockDataStore.getTodoListById(todoListId)

    if (!todoList) {
      throw createError('TodoList not found')
    }

    if (todoList.ownerId !== user.id) {
      throw createError('Not authorized to delete this list', 'FORBIDDEN')
    }

    const deleted = MockDataStore.deleteTodoList(todoListId)

    return deleted ? 1 : 0
  },

  // Todo operations
  getTodos: async (token, todoListId) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const todoList = MockDataStore.getTodoListById(todoListId)

    if (!todoList) {
      throw createError('TodoList not found')
    }

    if (todoList.ownerId !== user.id) {
      throw createError('Not authorized to view this list', 'FORBIDDEN')
    }

    const todos = MockDataStore.getTodos(todoListId)

    return todos.map(t => ({
      id: t.id,
      content: t.content,
      done: t.done
    }))
  },

  createTodo: async (token, todoListId, content, done = false) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const todoList = MockDataStore.getTodoListById(todoListId)

    if (!todoList) {
      throw createError('TodoList not found')
    }

    if (todoList.ownerId !== user.id) {
      throw createError('Not authorized to add to this list', 'FORBIDDEN')
    }

    if (!content || content.trim().length === 0) {
      throw createError('Content is required')
    }

    const newTodo = MockDataStore.createTodo(content, todoListId, done)

    return {
      id: newTodo.id,
      content: newTodo.content,
      done: newTodo.done
    }
  },

  updateTodo: async (token, todoId, done) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const todo = MockDataStore.getTodoById(todoId)

    if (!todo) {
      throw createError('Todo not found')
    }

    const todoList = MockDataStore.getTodoListById(todo.belongsToId)

    if (todoList.ownerId !== user.id) {
      throw createError('Not authorized to update this todo', 'FORBIDDEN')
    }

    const updated = MockDataStore.updateTodo(todoId, { done })

    return {
      id: updated.id,
      content: updated.content,
      done: updated.done
    }
  },

  deleteTodo: async (token, todoId) => {
    await delay(API_CONFIG.MOCK_DELAY)

    const user = MockDataStore.findUserByToken(token)

    if (!user) {
      throw createError('Invalid token', 'UNAUTHORIZED')
    }

    const todo = MockDataStore.getTodoById(todoId)

    if (!todo) {
      throw createError('Todo not found')
    }

    const todoList = MockDataStore.getTodoListById(todo.belongsToId)

    if (todoList.ownerId !== user.id) {
      throw createError('Not authorized to delete this todo', 'FORBIDDEN')
    }

    const deleted = MockDataStore.deleteTodo(todoId)

    return deleted ? 1 : 0
  }
}
