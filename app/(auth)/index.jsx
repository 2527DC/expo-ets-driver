// app/(auth)/permissions.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  MapPin,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';

// Expo permissions
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function PermissionsScreen() {
  const [checkingPermissions, setCheckingPermissions] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState({
    location: 'checking',
    backgroundLocation: 'checking',
    notifications: 'checking',
  });

  // Check all required permissions
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

      // Check background location
      try {
        const { status: backgroundLocationStatus } =
          await Location.getBackgroundPermissionsAsync();
        status.backgroundLocation = backgroundLocationStatus;
      } catch (error) {
        console.warn(
          'Background location permission check failed:',
          error.message
        );
        status.backgroundLocation = 'undetermined';
      }

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

      // Check if all required permissions are granted
      const allGranted =
        status.location === 'granted' &&
        status.backgroundLocation === 'granted' &&
        status.notifications === 'granted';

      setPermissionsGranted(allGranted);
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setCheckingPermissions(false);
    }
  };

  // Request location permissions
  const requestLocationPermissions = async () => {
    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
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

  // Request notification permission
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

  // Request all permissions
  const requestAllPermissions = async () => {
    setCheckingPermissions(true);

    try {
      await requestLocationPermissions();
      await requestNotificationPermission();

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

  // Open app settings
  const openAppSettings = () => {
    Linking.openSettings();
  };

  // Configure notifications
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

  const getPermissionStatusIcon = (status) => {
    switch (status) {
      case 'granted':
        return <CheckCircle size={20} color="#10B981" />;
      case 'denied':
        return <XCircle size={20} color="#EF4444" />;
      case 'undetermined':
        return <Clock size={20} color="#F59E0B" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getPermissionStatusText = (status) => {
    switch (status) {
      case 'granted':
        return { text: 'Granted', color: '#10B981' };
      case 'denied':
        return { text: 'Denied', color: '#EF4444' };
      case 'undetermined':
        return { text: 'Not Asked', color: '#F59E0B' };
      default:
        return { text: 'Checking...', color: '#6B7280' };
    }
  };

  const handleNext = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.jpeg')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Permissions Required</Text>
            <Text style={styles.heroSubtitle}>
              To provide the best experience, we need the following permissions
            </Text>
          </View>

          <View style={styles.permissionsList}>
            {/* Location Permission */}
            <View style={styles.permissionItem}>
              <View style={styles.permissionIcon}>
                <MapPin size={24} color="#3B82F6" />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionName}>Location Access</Text>
                <Text style={styles.permissionDescription}>
                  Required for trip tracking and navigation
                </Text>
              </View>
              <View style={styles.permissionStatus}>
                {getPermissionStatusIcon(permissionStatus.location)}
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: getPermissionStatusText(permissionStatus.location)
                        .color,
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
                <MapPin size={24} color="#8B5CF6" />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionName}>Background Location</Text>
                <Text style={styles.permissionDescription}>
                  Required for continuous trip tracking
                </Text>
              </View>
              <View style={styles.permissionStatus}>
                {getPermissionStatusIcon(permissionStatus.backgroundLocation)}
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
                    getPermissionStatusText(permissionStatus.backgroundLocation)
                      .text
                  }
                </Text>
              </View>
            </View>

            {/* Notifications Permission */}
            <View style={styles.permissionItem}>
              <View style={styles.permissionIcon}>
                <Bell size={24} color="#EC4899" />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionName}>Notifications</Text>
                <Text style={styles.permissionDescription}>
                  Required for trip updates and alerts
                </Text>
              </View>
              <View style={styles.permissionStatus}>
                {getPermissionStatusIcon(permissionStatus.notifications)}
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
                  {getPermissionStatusText(permissionStatus.notifications).text}
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
            <View style={styles.successSection}>
              <View style={styles.allPermissionsGranted}>
                <CheckCircle size={32} color="#10B981" />
                <Text style={styles.allPermissionsTitle}>
                  All Permissions Granted!
                </Text>
                <Text style={styles.allPermissionsText}>
                  You're all set! Continue to the login screen.
                </Text>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Continue to Login</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
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
  content: {
    flex: 1,
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionsList: {
    gap: 16,
    marginBottom: 30,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  permissionStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  permissionActions: {
    gap: 12,
  },
  grantPermissionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  grantPermissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  settingsButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  successSection: {
    gap: 20,
  },
  allPermissionsGranted: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  allPermissionsTitle: {
    color: '#065F46',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  allPermissionsText: {
    color: '#065F46',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
