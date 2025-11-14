import {
  getTodoLists as apiGetTodoLists,
  createTodoList as apiCreateTodoList,
  updateTodoList as apiUpdateTodoList,
  deleteTodoList as apiDeleteTodoList
} from '../api/apiService'

export function getTodoLists(token, username) {
  return apiGetTodoLists(token, username)
}

export function createTodoList(token, username, title) {
  return apiCreateTodoList(token, username, title)
}

export function updateTodoList(token, todoListId, title) {
  return apiUpdateTodoList(token, todoListId, title)
}

export function deleteTodoList(token, todoListId) {
  return apiDeleteTodoList(token, todoListId)
}
