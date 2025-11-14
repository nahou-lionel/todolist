import { signIn as apiSignIn } from '../api/apiService'

export function signIn(username, password) {
  return apiSignIn(username, password)
}