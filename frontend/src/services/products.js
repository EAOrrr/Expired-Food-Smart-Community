import axios from "axios";

const baseUrl = "/api/products";

// Returns a list of all products
const getAll = async (query) => {
  const response = await axios.get(baseUrl, { params: query });
  return response.data;
}

// Returns a single product by ID
const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data
}

// Returns the created product
// newObject is a FormData object
// with the following fields:
// name, price, description, stock, expiryDate
// and cover: a single image file
// and images: an array of image files (no more than 8)
/*
 * {
  *   name: String,
  *  price: Number,
  * description: String,
  * stock: Number,
  * expiryDate: Date,
  * cover: File,
  * images: [File]
  * }
  */

const create = async (newObject) => {
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
}

// Returns the updated product
// newObject is a FormData object
// with the following fields:
// name, price, description, stock, expiryDate
// and cover: a single image file
// and images: an array of image files (no more than 8)
/*
 * {
  *   name: String,
  *  price: Number,
  * description: String,
  * stock: Number,
  * expiryDate: Date,
  * cover: File,
  * images: [File]
  * }
  */
const update = async (id, newObject) => {
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
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