import axios from "axios"

const baseUrl = '/api/reviews'

// newObject: { orderId: String, content: String, rating: Number }
const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const remove = async (reviewId) => {
  const response = await axios.delete(`${baseUrl}/${reviewId}`)
  return response.data
}

export default {
  create,
  remove
}