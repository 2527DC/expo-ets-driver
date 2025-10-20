import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Phone,
  MapPin,
  CreditCard as Edit3,
  LogOut,
  Mail,
  Shield,
  Calendar,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [recentTrips] = useState([
    {
      id: 'TR001',
      route: 'Office Complex A → City Center',
      date: '2025-01-27',
      duration: '1h 15m',
      earnings: 250,
      rating: 5,
    },
    {
      id: 'TR002',
      route: 'Tech Park → Downtown',
      date: '2025-01-26',
      duration: '45m',
      earnings: 180,
      rating: 4,
    },
    {
      id: 'TR003',
      route: 'Mall → Residential Area',
      date: '2025-01-25',
      duration: '1h 30m',
      earnings: 320,
      rating: 5,
    },
  ]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            console.log('User logged out successfully');
            router.replace('/');
          } catch (error) {
            console.log('Error during logout:', error);
            Alert.alert('Logout Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const handleOfficeLocationView = () => {
    const latitude = 16.5062; // Andhra Pradesh (Amaravati)
    const longitude = 80.648;

    let url = '';

    if (Platform.OS === 'ios') {
      // Apple Maps
      url = `http://maps.apple.com/?ll=${latitude},${longitude}`;
    } else {
      // Android
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(Office)`;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // fallback to Google Maps website
          const browser_url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          Linking.openURL(browser_url);
        }
      })
      .catch((err) => {
        console.error('An error occurred', err);
        Alert.alert('Error', 'Unable to open maps');
      });
  };

  // Format user data with fallbacks
  const driverData = {
    name: user?.name || 'Driver',
    email: user?.email || 'No email provided',
    phone: user?.phone || 'No phone provided',
    code: user?.code || 'No code',
    gender: user?.gender || 'Not specified',
    vendor_id: user?.vendor_id || 'N/A',
    joinDate: '2023-03-15', // This would come from your API
    currentOffice: 'Office Complex A', // This would come from your API
    rating: 4.8,
    totalTrips: 1250,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
                }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.driverName}>{driverData.name}</Text>
              <Text style={styles.driverCode}>Code: {driverData.code}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {driverData.rating}</Text>
                <Text style={styles.tripsText}>
                  • {driverData.totalTrips} trips
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Mail size={16} color="#64748B" />
              <Text style={styles.detailText}>{driverData.email}</Text>
            </View>
            <View style={styles.detailItem}>
              <Phone size={16} color="#64748B" />
              <Text style={styles.detailText}>{driverData.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <User size={16} color="#64748B" />
              <Text style={styles.detailText}>{driverData.gender}</Text>
            </View>
            <View style={styles.detailItem}>
              <Shield size={16} color="#64748B" />
              <Text style={styles.detailText}>
                Vendor ID: {driverData.vendor_id}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={16} color="#64748B" />
              <Text style={styles.detailText}>{driverData.currentOffice}</Text>
            </View>
            <View style={styles.detailItem}>
              <Calendar size={16} color="#64748B" />
              <Text style={styles.detailText}>
                Joined: {driverData.joinDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleOfficeLocationView}
          >
            <MapPin size={20} color="#10B981" />
            <Text style={styles.actionText}>Office Location </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, styles.logoutAction]}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2563EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  driverDL: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  profileDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  recentTripsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tripDuration: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    marginRight: 12,
  },
  tripDate: {
    fontSize: 12,
    color: '#64748B',
  },
  tripEarnings: {
    alignItems: 'flex-end',
  },
  earningsAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  tripRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tripRatingText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 2,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginLeft: 12,
  },
  logoutAction: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#EF4444',
  },
});
