// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set your backend API base URL here
const API_BASE_URL = 'https://api.gocab.tech/api';

 const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to attach token
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response || error.message);
    return Promise.reject(error);
  }
);

export default client;
