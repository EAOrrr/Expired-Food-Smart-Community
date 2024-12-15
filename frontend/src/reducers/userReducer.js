/**
 * @description: This file contains the user reducer which is responsible for handling the user state in the redux store.
 * The user reducer is responsible for handling the following actions:
 * 1. SET_USER: This action is dispatched when the user logs in and the user details are stored in the redux store.
 * 2. CLEAR_USER: This action is dispatched when the user logs out and the user details are removed from the redux store.
 */

import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import userService from '../services/user'
import storage from '../services/storage'
import user from '../services/user'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null,
    loading: true
  },
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        info: action.payload
      }
    },
    clearUser(state) {
      return {
        info: null,
        loading: false
      }
    },
    setUserStatus(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    },
    updateUser(state, action) {
      console.log({
        ...user.info,
        ...action.payload
      })
      return {
        ...state,
        info: {
          ...state.info,
          ...action.payload
        }
      }
    },
  }
})

export const login = ( credential ) => {
  return async dispatch => {
    try {
      dispatch(setUserStatus(true))
      const user = await loginService.login(credential)
      storage.saveUser(user)
      dispatch(setUser(user))
      dispatch(setUserStatus(false))
    }
    catch (exception) {
      dispatch(setUserStatus(false))
      throw exception
    }
  }
}

export const logout = () => {
  return async dispatch => {
    storage.clearUser()
    dispatch(clearUser())
    dispatch(setUserStatus(false))
  }
}

export const initializeUser = () => {
  return async dispatch => {
    const userWithOldToken = storage.loadUser()
    if (!userWithOldToken) {
      dispatch(setUserStatus(false))
      return
    }
    try {
      dispatch(setUserStatus(true))
      const user = await userService.getInfo()
      dispatch(setUser(user))
      dispatch(setUserStatus(false))
    } catch (exception) {
      // Attempt to refresh token or re-authenticate
      
      storage.clearUser()
      dispatch(clearUser())
      dispatch(setUserStatus(false))
    }
  }
}

export const refetchUserInfo = () => {
  return async dispatch => {
    try {
      const user = await userService.getInfo()
      dispatch(setUser(user))
    } catch (exception) {
      console.error('Failed to update user info:', exception)
    }
  }
}

export const { setUser, clearUser, setUserStatus, updateUser } = userSlice.actions
export default userSlice.reducer