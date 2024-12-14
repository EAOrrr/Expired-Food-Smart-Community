import axios from 'axios'

const baseUrl = '/api/users'

// 创建新用户
// newObject: { username: String, password: String, phone: String, address: String }
const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

/* 
获取自己的信息
query 格式
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

// 获取其他用户信息
const getUserInfo = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`)
  return response.data
}

// 更新自己的信息 （balance 除外）
// newObject: { username: String, password: String, phone: String, address: String }
const update = async (newObject) => {
  const response = await axios.put(`${baseUrl}/me`, newObject)
  return response.data
}

// 存钱 amount: Number
const deposit = async (amount) => {
  const response = await axios.post(`${baseUrl}/me/deposit`, { amount })
  return response.data
}

// 账单
const getBills = async () => {
  const response = await axios.get(`${baseUrl}/me/bills`)
  return response.data
}


export default {
  getInfo,
  create,
  update,
  getUserInfo,
  deposit,
  getBills,
}