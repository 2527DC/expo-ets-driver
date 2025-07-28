import React, { useEffect, useState } from 'react';
import SplashScreenComponent from '@/components/SplashScreen';
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
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Truck, CreditCard, Smartphone, Shield } from 'lucide-react-native';
import firebaseApp from '../utils/firebaseConfig';
import { getApps } from 'firebase/app';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [dlNumber, setDlNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  // console.log("this is the user ", user);

  // Insert static data into Firebase
  const insertStaticData = async () => {
    console.log('Database URL:', firebase.app().options.databaseURL);

    try {
      await database().ref('staticData/driverInfo').set({
        driverName: 'John Doe',
        licenseNumber: 'DL12345678',
      });
      console.log('Data inserted successfully!');
      return true;
    } catch (error) {
      console.error('Error inserting data:', error);
      return false;
    }
  };

  // Check for user authentication and Firebase initialization
  useEffect(() => {
    // If user is already logged in, redirect to the main app
    if (user) {
      router.replace('/(tabs)');
      return;
    }

    // Initialize static data and check Firebase
    insertStaticData();
    if (getApps().length) {
      console.log('✅ Firebase initialized:', firebaseApp.name);
    } else {
      console.warn('⚠️ Firebase not initialized!');
    }
  }, [user]);

  // Show splash screen while checking auth state
  if (showSplash) {
    return <SplashScreenComponent onFinish={() => setShowSplash(false)} />;
  }

  // If user is logged in, don't render the login screen
  if (user) {
    return null; // or a loading spinner if needed
  }

  const generateUniqueId = (phone) => {
    const timestamp = Date.now().toString(36);
    const phoneHash = phone.replace(/\D/g, '').slice(-10);
    return `DRV-${phoneHash}-${timestamp.toUpperCase()}`;
  };

  const handleLogin = async () => {
    if (!dlNumber || !phoneNumber) {
      Alert.alert('Error', 'Please enter both DL number and phone number');
      return;
    }

    if (dlNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid DL number');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    const payload = {
      username: 'admin@gmail.com',
      password: 'dp',
      device_uuid: 'test-device-uuid-1231aqs',
      device_name: 'Samsung A501',
      fcm_token: 'test-fcm-token-123',
      grant_type: 'password',
      client_id: 'dummy-client-id',
      client_secret: 'dummy-client-secret',
      force_logout: true,
    };

    try {
      const result = await loginUser(payload);
      console.log('Login Success:', result);

      const uniqueId = generateUniqueId(phoneNumber);

      // Update auth context with login data
      login({ uniqueId, dlNumber, phoneNumber });

      Alert.alert(
        'Login Successful',
        `Welcome! Your unique driver ID is: ${uniqueId}`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.log("This is the error:", error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Truck size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Driver Portal</Text>
          <Text style={styles.subtitle}>Professional Transport Services</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Driver Login</Text>
          <Text style={styles.loginSubtitle}>
            Enter your credentials to access your dashboard
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <CreditCard size={20} color="#64748B" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter DL Number (e.g., MH12AB1234)"
                value={dlNumber}
                onChangeText={setDlNumber}
                autoCapitalize="characters"
                maxLength={16}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Smartphone size={20} color="#64748B" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={13}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.securityInfo}>
            <Shield size={16} color="#10B981" />
            <Text style={styles.securityText}>
              Your phone signature will be used to create a unique driver ID
            </Text>
          </View>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Driver Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Real-time trip management</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>OTP-based employee pickup</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Background operation support
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Multi-office management</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
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
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  securityText: {
    fontSize: 12,
    color: '#065F46',
    marginLeft: 8,
    flex: 1,
  },
  features: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#CBD5E1',
  },
});