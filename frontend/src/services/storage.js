/**
 * This file is used to store and retrieve user information from local storage.
 * Functions:
 * saveUser: save user information to local storage
 * loadUser: load user information from local storage
 * me: get the username of the current user
 * clearUser: clear user information from local storage
 */


const TOKEN_KEY = 'token'
const saveUser = (user) => {
  localStorage.setItem(TOKEN_KEY, user.token)
}

const loadUser = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { token } : null
}

const getAccessToken = () => {
  const user = loadUser()
  return user ? user.token : null
}


const clearUser = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export default {
  saveUser,
  loadUser,
  clearUser,
  getAccessToken,
}

