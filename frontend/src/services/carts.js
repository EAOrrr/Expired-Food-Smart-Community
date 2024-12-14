import axios from 'axios'

const baseUrl = '/api/carts'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// newObject: { quantity: Number }
const create = async (productId, newObject) => {
  const response = await axios.post(`${baseUrl}/${productId}`, newObject)
  return response.data
}

// newObject: { quantity: Number }
const update = async (cartId, newObject) => {
  const response = await axios.put(`${baseUrl}/${cartId}`, newObject)
  return response.data
}

const remove = async (cartId) => {
  const response = await axios.delete(`${baseUrl}/${cartId}`)
  return response.data
}

export default {
  getAll,
  create,
  update,
  remove
}