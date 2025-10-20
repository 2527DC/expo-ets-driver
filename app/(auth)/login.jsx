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
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  Truck,
  CreditCard,
  Shield,
  User,
  Lock,
  MapPin,
  Bell,
  Eye,
} from 'lucide-react-native';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

// Expo permissions
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState({
    location: 'checking',
    backgroundLocation: 'checking',
    overlay: 'checking',
    notifications: 'checking',
  });

  const { user, login } = useAuth();

  // Default values for login fields
  const [credentials, setCredentials] = useState({
    tenant_id: 'SAM001',
    username: 'john@ex1ample.clllhq',
    password: 'StrongPassword123',
  });

  const [errors, setErrors] = useState({});

  // Check Android overlay permission (using Platform-specific code)
  const checkOverlayPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For Android, we need to check Settings.canDrawOverlays
        // This requires additional native configuration
        return 'granted'; // We'll handle this properly below
      } catch (error) {
        console.error('Error checking overlay permission:', error);
        return 'denied';
      }
    }
    return 'granted'; // iOS doesn't have overlay permission
  };

  // Check all required permissions using Expo
  // Check all required permissions using Expo
  const checkAllPermissions = async () => {
    setCheckingPermissions(true);

    try {
      const status = { ...permissionStatus };

      // Check foreground location
      try {
        const { status: locationStatus } =
          await Location.getForegroundPermissionsAsync();
        status.location = locationStatus;
      } catch (error) {
        console.warn('Error checking foreground location:', error);
        status.location = 'undetermined';
      }

      // Check background location with better error handling
      try {
        const { status: backgroundLocationStatus } =
          await Location.getBackgroundPermissionsAsync();
        status.backgroundLocation = backgroundLocationStatus;
      } catch (error) {
        console.warn(
          'Background location permission check failed:',
          error.message
        );
        // If background location fails, we'll still allow the app to work
        status.backgroundLocation = 'undetermined';
      }

      // Check overlay permission
      const overlayStatus = await checkOverlayPermission();
      status.overlay = overlayStatus;

      // Check notifications
      try {
        const { status: notificationStatus } =
          await Notifications.getPermissionsAsync();
        status.notifications = notificationStatus;
      } catch (error) {
        console.warn('Error checking notifications:', error);
        status.notifications = 'undetermined';
      }

      setPermissionStatus(status);

      // Allow login if at least foreground location is granted
      // Background location is nice-to-have but not blocking
      const minimumPermissionsGranted = status.location === 'granted';
      setPermissionsGranted(minimumPermissionsGranted);
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setCheckingPermissions(false);
    }
  };

  // Request location permissions using Expo
  const requestLocationPermissions = async () => {
    try {
      // Request foreground location permission
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      // Request background location permission
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      setPermissionStatus((prev) => ({
        ...prev,
        location: foregroundStatus,
        backgroundLocation: backgroundStatus,
      }));

      return { foregroundStatus, backgroundStatus };
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return { foregroundStatus: 'denied', backgroundStatus: 'denied' };
    }
  };

  // Request notification permission using Expo
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus((prev) => ({
        ...prev,
        notifications: status,
      }));
      return status;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  // Handle overlay permission for Android
  const requestOverlayPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For Android, we need to guide user to enable overlay permission manually
        Alert.alert(
          'Overlay Permission Required',
          'Please enable "Display over other apps" permission for this app to show trip information overlays.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                // This will open the specific overlay settings for your app
                Linking.openSettings();
              },
            },
          ]
        );
        return 'granted'; // We assume they'll grant it manually
      } catch (error) {
        console.error('Error requesting overlay permission:', error);
        return 'denied';
      }
    }
    return 'granted';
  };

  // Request all permissions
  const requestAllPermissions = async () => {
    setCheckingPermissions(true);

    try {
      // Request location permissions
      await requestLocationPermissions();

      // Request notification permission
      await requestNotificationPermission();

      // Request overlay permission
      await requestOverlayPermission();

      // Re-check permissions after requesting
      setTimeout(() => {
        checkAllPermissions();
      }, 1000);
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setCheckingPermissions(false);
    }
  };

  // Open app settings for manual permission granting
  const openAppSettings = () => {
    Linking.openSettings();
  };

  // Configure notifications (important for background operation)
  const configureNotifications = async () => {
    try {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    } catch (error) {
      console.error('Error configuring notifications:', error);
    }
  };

  // Check permissions on component mount
  useEffect(() => {
    checkAllPermissions();
    configureNotifications();
  }, []);

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

    // Check if all permissions are granted
    if (!permissionsGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant all required permissions to use the app. These permissions are essential for:\n\n• Location: Trip tracking and navigation\n• Background Location: Continuous trip monitoring\n• Overlay: Showing trip information while using other apps\n• Notifications: Trip updates and alerts',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permissions', onPress: requestAllPermissions },
        ]
      );
      return;
    }

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
        device_uuid: 'test-device-uuid-1231aqs',
        device_name: 'Samsung A501',
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
      username: 'john@ex1ample.clllhq',
      password: 'StrongPassword123',
    });
    setErrors({});
  };

  const getPermissionStatusText = (status) => {
    switch (status) {
      case 'granted':
        return { text: 'Granted', color: '#10B981' };
      case 'denied':
        return { text: 'Denied', color: '#EF4444' };
      case 'undetermined':
        return { text: 'Not Asked', color: '#6B7280' };
      default:
        return { text: 'Checking...', color: '#6B7280' };
    }
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

          {/* Permissions Section */}
          <View style={styles.permissionsCard}>
            <Text style={styles.permissionsTitle}>App Permissions</Text>
            <Text style={styles.permissionsSubtitle}>
              The following permissions are required for the app to function
              properly:
            </Text>

            <View style={styles.permissionsList}>
              {/* Location Permission */}
              <View style={styles.permissionItem}>
                <View style={styles.permissionIcon}>
                  <MapPin size={20} color="#3B82F6" />
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionName}>Location Access</Text>
                  <Text style={styles.permissionDescription}>
                    Required for trip tracking and navigation
                  </Text>
                </View>
                <View style={styles.permissionStatus}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: getPermissionStatusText(
                          permissionStatus.location
                        ).color,
                      },
                    ]}
                  >
                    {getPermissionStatusText(permissionStatus.location).text}
                  </Text>
                </View>
              </View>

              {/* Background Location Permission */}
              <View style={styles.permissionItem}>
                <View style={styles.permissionIcon}>
                  <MapPin size={20} color="#8B5CF6" />
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionName}>Background Location</Text>
                  <Text style={styles.permissionDescription}>
                    Required for continuous trip tracking
                  </Text>
                </View>
                <View style={styles.permissionStatus}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: getPermissionStatusText(
                          permissionStatus.backgroundLocation
                        ).color,
                      },
                    ]}
                  >
                    {
                      getPermissionStatusText(
                        permissionStatus.backgroundLocation
                      ).text
                    }
                  </Text>
                </View>
              </View>

              {/* Overlay Permission */}
              <View style={styles.permissionItem}>
                <View style={styles.permissionIcon}>
                  <Eye size={20} color="#F59E0B" />
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionName}>
                    Display Over Other Apps
                  </Text>
                  <Text style={styles.permissionDescription}>
                    Required for showing trip information overlays
                  </Text>
                </View>
                <View style={styles.permissionStatus}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: getPermissionStatusText(permissionStatus.overlay)
                          .color,
                      },
                    ]}
                  >
                    {getPermissionStatusText(permissionStatus.overlay).text}
                  </Text>
                </View>
              </View>

              {/* Notifications Permission */}
              <View style={styles.permissionItem}>
                <View style={styles.permissionIcon}>
                  <Bell size={20} color="#EC4899" />
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionName}>Notifications</Text>
                  <Text style={styles.permissionDescription}>
                    Required for trip updates and alerts
                  </Text>
                </View>
                <View style={styles.permissionStatus}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: getPermissionStatusText(
                          permissionStatus.notifications
                        ).color,
                      },
                    ]}
                  >
                    {
                      getPermissionStatusText(permissionStatus.notifications)
                        .text
                    }
                  </Text>
                </View>
              </View>
            </View>

            {!permissionsGranted && (
              <View style={styles.permissionActions}>
                <TouchableOpacity
                  style={styles.grantPermissionButton}
                  onPress={requestAllPermissions}
                  disabled={checkingPermissions}
                >
                  <Text style={styles.grantPermissionText}>
                    {checkingPermissions
                      ? 'Checking...'
                      : 'Grant All Permissions'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={openAppSettings}
                >
                  <Text style={styles.settingsText}>Open Settings</Text>
                </TouchableOpacity>
              </View>
            )}

            {permissionsGranted && (
              <View style={styles.allPermissionsGranted}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.allPermissionsText}>
                  All permissions granted! You can now login.
                </Text>
              </View>
            )}
          </View>

          {/* Rest of your login form remains the same */}
          {/* ... (your existing login form code) ... */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Add the missing styles
const styles = StyleSheet.create({
  // ... (your existing styles) ...
  permissionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  permissionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  permissionsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  permissionsList: {
    gap: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  permissionStatus: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  permissionActions: {
    marginTop: 20,
    gap: 12,
  },
  grantPermissionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  grantPermissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  allPermissionsGranted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginTop: 16,
  },
  allPermissionsText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
