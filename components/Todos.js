import {
  getTodos as apiGetTodos,
  createTodo as apiCreateTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo
} from '../api/apiService'

export function getTodos(token, todoListId) {
  return apiGetTodos(token, todoListId)
}

export function createTodo(token, todoListId, content, done = false) {
  return apiCreateTodo(token, todoListId, content, done)
}

export function updateTodo(token, todoId, updates) {
  return apiUpdateTodo(token, todoId, updates)
}

export function deleteTodo(token, todoId) {
  return apiDeleteTodo(token, todoId)
}
