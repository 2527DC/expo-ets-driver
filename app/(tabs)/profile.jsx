import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Phone,
  MapPin,
  Clock,
  Star,
  CreditCard as Edit3,
  LogOut,
  Award,
  TrendingUp,
} from 'lucide-react-native';

export default function Profile() {
  const [driver, setDriver] = useState({
    id: 'DR001',
    name: 'Rajesh Kumar',
    dlNumber: 'MH12AB1234',
    phone: '+91 9876543210',
    rating: 4.8,
    totalTrips: 1250,
    totalDistance: 45000,
    joinDate: '2023-03-15',
    currentOffice: 'Office Complex A',
    uniqueId: 'DRV-9876543210-SIGN123',
  });

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
        onPress: () => console.log('Logout'),
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Edit3 size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverDL}>DL: {driver.dlNumber}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#F59E0B" />
                <Text style={styles.rating}>{driver.rating}</Text>
                <Text style={styles.ratingCount}>
                  ({driver.totalTrips} trips)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Phone size={16} color="#64748B" />
              <Text style={styles.detailText}>{driver.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={16} color="#64748B" />
              <Text style={styles.detailText}>{driver.currentOffice}</Text>
            </View>
            <View style={styles.detailItem}>
              <User size={16} color="#64748B" />
              <Text style={styles.detailText}>ID: {driver.uniqueId}</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.statNumber}>{driver.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>

          <View style={styles.statCard}>
            <MapPin size={24} color="#2563EB" />
            <Text style={styles.statNumber}>
              {driver.totalDistance.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>KM Driven</Text>
          </View>

          <View style={styles.statCard}>
            <Award size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{driver.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Recent Trips */}
        <View style={styles.recentTripsCard}>
          <Text style={styles.cardTitle}>Recent Trips</Text>
          {recentTrips.map((trip) => (
            <View key={trip.id} style={styles.tripItem}>
              <View style={styles.tripInfo}>
                <Text style={styles.tripRoute}>{trip.route}</Text>
                <View style={styles.tripMeta}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.tripDuration}>{trip.duration}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                </View>
              </View>
              <View style={styles.tripEarnings}>
                <Text style={styles.earningsAmount}>₹{trip.earnings}</Text>
                <View style={styles.tripRating}>
                  <Star size={12} color="#F59E0B" />
                  <Text style={styles.tripRatingText}>{trip.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Account Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem}>
            <Edit3 size={20} color="#2563EB" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <MapPin size={20} color="#10B981" />
            <Text style={styles.actionText}>Change Office</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Award size={20} color="#F59E0B" />
            <Text style={styles.actionText}>View Certificates</Text>
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
