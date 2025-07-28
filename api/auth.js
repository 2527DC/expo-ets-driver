// api/auth.js
import client from '@/context/API_CLIENT';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (data) => {
  try {
    const response = await client.post(
      '/employees/auth/employee/login',
      qs.stringify(data),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const result = response.data;

    // Save token and user info
    await AsyncStorage.setItem('authToken', result.access_token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(result));

    return result;
  } catch (error) {
    console.error('Login error:', error?.response?.data || error.message);
    throw error;
  }
};
