import axios from "axios";

const baseUrl = "/api/products";

// Returns a list of all products
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
}

// Returns a single product by ID
const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data
}

// Returns the created product
const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject);
  return response.data;
}

// Returns the updated product
const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
}

// Returns the deleted product
const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
}

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
}