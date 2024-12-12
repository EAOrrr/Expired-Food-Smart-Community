import axios from "axios";

const baseUrl = '/api/orders'

const getAllBuyOrders = async () => {
  const response = await axios.get(`${baseUrl}/buy`)
  return response.data
}

const getAllSellOrders = async () => {
  const response = await axios.get(`${baseUrl}/sell`)
  return response.data
}

/*
格式:
{
  productId: ---,
  quantity: ---,
  idempotencyKey: ---,(随机生成的uuid，用于幂等性，注意防止多次提交)
}
*/
const createByProduct = async (newObject) => {
  const response = await axios.post(`${baseUrl}/product`, newObject)
  return response.data
}

/*
格式:
{
  cartIds: [---, ---, ---],
  idempotencyKey: ---,(随机生成的uuid，用于幂等性，注意防止多次提交)
}
*/

const createByCart = async (newObject) => {
  const response = await axios.post(`${baseUrl}/cart`, newObject)
  return response.data
}

const update = async (orderId, newObject) => {
  const response = await axios.put(`${baseUrl}/${orderId}`, newObject)
  return response.data
}

export default {
  getAllBuyOrders,
  getAllSellOrders,
  createByProduct,
  createByCart,
  update
}

