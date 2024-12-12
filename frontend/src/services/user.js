import axios from 'axios'
import storage from '../services/storage'

const baseUrl = '/api/users'


const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const getInfo = async () => {
  const response = await axios.get(`${baseUrl}/me`)
  return response.data
}


export default {
  getInfo,
  create,
}