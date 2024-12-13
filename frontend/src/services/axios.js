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

