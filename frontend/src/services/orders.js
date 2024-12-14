import axios from "axios";
import { v4 as uuidv4 } from 'uuid'

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
  productId: String, // 商品id
  quantity: Number,
}
*/
const createByProduct = async (newObject) => {
  const response = await axios.post(`${baseUrl}/product`, {...newObject, idempotencyKey: uuidv4()})
  return response.data
}

/*
newObject:
{
  cartIds: [ cartId ] 
}
*/
const createByCart = async (newObject) => {
  const response = await axios.post(`${baseUrl}/cart`, {...newObject, idempotencyKey: uuidv4()})
  return response.data
}

// 模拟快递状态变更
  // 1. 买家下单后，订单状态为 Pending
  // 2. 卖家接单后，订单状态为 Delivering，只能卖家操作
  // 3. 买家收到货后，订单状态为 Delivered，卖家收到钱，只能买家操作，（或者卖家发起时离订单上一次更新时间超过 7 天）
  // 4. 买家取消订单后，订单状态为 Cancelled，把钱退回买家账户，买家或卖家操作
  // 状态变更只能由买家或卖家操作，其他用户无权操作
  // 状态转换如下： 1 --> 2 --> 3
  //               |     |     
  //               4     4     
  // 使用事务保证状态变更的原子性
  // newObject: { status: String }
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

