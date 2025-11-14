import { signUp as apiSignUp } from '../api/apiService'

export function signUp(username, password) {
  return apiSignUp(username, password)
}