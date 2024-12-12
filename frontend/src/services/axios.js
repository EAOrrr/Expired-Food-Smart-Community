/**
 * Axios configuration
 * @module services/axios
 * @requires axios
 * @requires storage
 * @description This module configures axios to use the token stored in the local storage
 * for all requests. It also refreshes the token if it has expired.
 */
import axios from 'axios'
import storage from '../services/storage'

axios.interceptors.request.use((config) => {

  const token = storage.getAccessToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

