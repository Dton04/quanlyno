import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getProducts = () => axios.get(`${API_URL}/api/products`);
export const createProduct = (data) => axios.post(`${API_URL}/api/products/add`, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/api/products/update/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/api/products/delete/${id}`);