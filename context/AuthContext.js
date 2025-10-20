// context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        const userData = await AsyncStorage.getItem('user_data');
        const tenantId = await AsyncStorage.getItem('tenant_id');

        if (accessToken && userData) {
          setUser(JSON.parse(userData));
          setTokens({
            access_token: accessToken,
            refresh_token: refreshToken,
            tenant_id: tenantId,
          });
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (authData) => {
    try {
      // Store all authentication data
      await AsyncStorage.setItem('access_token', authData.access_token);
      await AsyncStorage.setItem('refresh_token', authData.refresh_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
      await AsyncStorage.setItem('tenant_id', authData.tenant_id);

      // Update state
      setUser(authData.user);
      setTokens({
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
        tenant_id: authData.tenant_id,
      });
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Clear all stored auth data
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('tenant_id');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');

      // Reset state
      setUser(null);
      setTokens(null);
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  const updateUser = async (userData) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('Update user failed:', err);
      throw err;
    }
  };

  const getAccessToken = async () => {
    return await AsyncStorage.getItem('access_token');
  };

  const isAuthenticated = () => {
    return !!(user && tokens?.access_token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        loading,
        updateUser,
        getAccessToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
