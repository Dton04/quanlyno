import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getUsers = () => axios.get(`${API_URL}/api/debts/users`);
export const getUserDebts = (userId) => axios.get(`${API_URL}/api/debts/user/${userId}`);
export const addUser = (userData) => axios.post(`${API_URL}/api/debts/add-user-debt`, userData);
export const addDebt = (debtData) => axios.post(`${API_URL}/api/debts/add`, debtData);
export const updateDebtStatus = (debtId, status) => axios.put(`${API_URL}/api/debts/update`, { debtId, status });
export const makePayment = (userId, amount) => axios.post(`${API_URL}/api/debts/payment/${userId}`, { amount });