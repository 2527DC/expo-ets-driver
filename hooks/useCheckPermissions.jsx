import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function useCheckPermissions() {
  const [allGranted, setAllGranted] = useState(false);

  const checkAllPermissions = useCallback(async () => {
    try {
      const { status: locationStatus } =
        await Location.getForegroundPermissionsAsync();
      const { status: backgroundStatus } =
        await Location.getBackgroundPermissionsAsync();
      const { status: notificationStatus } =
        await Notifications.getPermissionsAsync();

      const granted =
        locationStatus === 'granted' &&
        backgroundStatus === 'granted' &&
        notificationStatus === 'granted' &&
        setAllGranted(granted);

      if (!granted) {
        Alert.alert(
          'Permissions required',
          'Please grant all permissions to proceed.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Open app settings so user can grant permissions manually
                Linking.openSettings();
              },
              style: 'default',
            },
          ],
          { cancelable: false } // Prevent dismiss without pressing OK
        );
      }
    } catch (e) {
      console.error('Error checking permissions:', e);
      setAllGranted(false);
    }
  }, []);

  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  return allGranted;
}
