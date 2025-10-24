// app/(auth)/login.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { CreditCard, Shield, User, Lock } from 'lucide-react-native';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  // Default values for login fields
  const [credentials, setCredentials] = useState({
    tenant_id: 'SAM001',
    username: 'john@ex1ample.clllhq',
    password: 'StrongPassword123',
  });

  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!credentials.tenant_id?.trim()) {
      newErrors.tenant_id = 'Tenant ID is required';
    }

    if (!credentials.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.username)) {
      newErrors.username = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // If user is logged in, redirect to tabs
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleLogin = async () => {
    console.log('Login method invoked');

    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting'
      );
      return;
    }

    setLoading(true);

    try {
      // Prepare payload according to your API requirements
      const payload = {
        tenant_id: credentials.tenant_id,
        username: credentials.username,
        password: credentials.password,
        device_uuid: 'test-device-uuid-123',
        device_name: 'Samsung A51',
        fcm_token: 'test-fcm-token-123',
        grant_type: 'password',
        client_id: 'dummy-client-id',
        client_secret: 'dummy-client-secret',
        force_logout: true,
      };

      console.log('Sending login request with:', {
        tenant_id: credentials.tenant_id,
        username: credentials.username,
        password: '***',
      });

      const result = await loginUser(payload);
      console.log('Login Response:', result);

      if (result.success && result.data) {
        // Update auth context with login data
        login({
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token,
          user: result.data.user.driver,
          tenant_id: credentials.tenant_id,
        });

        // Store tokens securely
        await AsyncStorage.setItem('access_token', result.data.access_token);
        await AsyncStorage.setItem('refresh_token', result.data.refresh_token);
        await AsyncStorage.setItem(
          'user_data',
          JSON.stringify(result.data.user.driver)
        );

        Alert.alert(
          'Login Successful',
          `Welcome ${result.data.user.driver.name}!`,
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.log('Login Error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        const serverError = error.response.data;
        errorMessage =
          serverError.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setCredentials({
      tenant_id: '',
      username: '',
      password: '',
    });
    setErrors({});
  };

  const resetToDefault = () => {
    setCredentials({
      tenant_id: 'SAM001',
      username: 'john@example.com',
      password: 'StrongPassword123',
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo.jpeg')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Driver Login</Text>
            <Text style={styles.loginSubtitle}>
              Enter your credentials to access your dashboard
            </Text>

            <View style={styles.inputContainer}>
              {/* Tenant ID Field */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <User size={20} color="#64748B" />
                </View>
                <TextInput
                  style={[styles.input, errors.tenant_id && styles.inputError]}
                  placeholder="Enter Tenant ID"
                  value={credentials.tenant_id}
                  onChangeText={(value) =>
                    handleInputChange('tenant_id', value)
                  }
                  placeholderTextColor="#94A3B8"
                  editable={!loading}
                />
              </View>
              {errors.tenant_id && (
                <Text style={styles.errorText}>{errors.tenant_id}</Text>
              )}

              {/* Username/Email Field */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <CreditCard size={20} color="#64748B" />
                </View>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="Enter Username/Email"
                  value={credentials.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#94A3B8"
                  editable={!loading}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              {/* Password Field */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color="#64748B" />
                </View>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter Password"
                  value={credentials.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  placeholderTextColor="#94A3B8"
                  editable={!loading}
                />
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <View style={styles.utilityButtons}>
                <TouchableOpacity
                  style={[styles.utilityButton, styles.clearButton]}
                  onPress={clearFields}
                  disabled={loading}
                >
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.utilityButton, styles.defaultButton]}
                  onPress={resetToDefault}
                  disabled={loading}
                >
                  <Text style={styles.defaultButtonText}>Use Default</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.securityInfo}>
              <Shield size={16} color="#10B981" />
              <Text style={styles.securityText}>
                Your credentials are securely encrypted and transmitted
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#1E40AF',
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  inputIcon: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  utilityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  utilityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  clearButton: {
    borderColor: '#EF4444',
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  defaultButton: {
    borderColor: '#10B981',
  },
  defaultButtonText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    gap: 8,
  },
  securityText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '500',
  },
});
