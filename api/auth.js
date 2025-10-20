import client from '@/context/API_CLIENT';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (data) => {
  console.log('Login method invoked');

  try {
    const response = await client.post(
      '/auth/driver/login',
      data, // Send data directly as object
      {
        headers: {
          'Content-Type': 'application/json', // Changed to JSON
        },
      }
    );

    const result = response.data;

    // Save token and user info
    await AsyncStorage.setItem('authToken', result.data.access_token);
    await AsyncStorage.setItem('refreshToken', result.data.refresh_token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(result.data.user));
    await AsyncStorage.setItem('loginData', JSON.stringify(result));

    console.log('Login successful, tokens saved');
    return result;
  } catch (error) {
    console.error('Login error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
