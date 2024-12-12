import axios from 'axios'
import storage from '../services/storage'

const baseUrl = '/api/users'


const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

/* query 格式
{ 
  query1: value1,
  query2: value2
}
目前后端仅设置了一个review query
'both': 返回所有review
'given': 返回用户给出的review
'received': 返回用户收到的review
*/
const getInfo = async (query) => {
  const response = await axios.get(`${baseUrl}/me`, { params: query })
  return response.data
}

const update = async (newObject) => {
  const response = await axios.put(`${baseUrl}/me`, newObject)
  return response.data
}

const getUserInfo = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`)
  return response.data
}



export default {
  getInfo,
  create,
  update,
  getUserInfo
}