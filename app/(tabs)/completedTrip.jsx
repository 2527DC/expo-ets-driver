import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  MapPin,
  Clock,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  Navigation,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

export default function Trips() {
  const [expandedTrips, setExpandedTrips] = useState({});

  const [trips, setTrips] = useState([
    {
      id: 'TR001',
      source: 'Office Complex A',
      destination: 'City Center Mall',
      date: '2025-01-27',
      startTime: '08:30 AM',
      status: 'active',
      coordinates: { lat: 19.076, lng: 72.8777 },
      employees: [
        {
          id: 'E001',
          name: 'John Doe',
          phone: '+91 9912345678',
          pickupPoint: 'Metro Station A',
          status: 'picked',
          pickupOrder: 1,
        },
        {
          id: 'E002',
          name: 'Jane Smith',
          phone: '+91 9912345679',
          pickupPoint: 'Bus Stop B',
          status: 'picked',
          pickupOrder: 2,
        },
        {
          id: 'E003',
          name: 'Mike Johnson',
          phone: '+91 9912345680',
          pickupPoint: 'Mall C',
          status: 'pending',
          otp: '1234',
          pickupOrder: 3,
        },
        {
          id: 'E004',
          name: 'Sarah Wilson',
          phone: '+91 9912345681',
          pickupPoint: 'Park D',
          status: 'pending',
          otp: '5678',
          pickupOrder: 4,
        },
        {
          id: 'E005',
          name: 'Tom Brown',
          phone: '+91 9912345682',
          pickupPoint: 'School E',
          status: 'pending',
          otp: '9012',
          pickupOrder: 5,
        },
        {
          id: 'E006',
          name: 'Lisa Davis',
          phone: '+91 9912345683',
          pickupPoint: 'Hospital F',
          status: 'pending',
          otp: '3456',
          pickupOrder: 6,
        },
        {
          id: 'E007',
          name: 'David Miller',
          phone: '+91 9912345684',
          pickupPoint: 'Library G',
          status: 'pending',
          otp: '7890',
          pickupOrder: 7,
        },
        {
          id: 'E008',
          name: 'Emma Wilson',
          phone: '+91 9912345685',
          pickupPoint: 'Station H',
          status: 'pending',
          otp: '2468',
          pickupOrder: 8,
        },
      ],
    },
    {
      id: 'TR002',
      source: 'Tech Park',
      destination: 'Downtown Plaza',
      date: '2025-01-27',
      startTime: '02:00 PM',
      status: 'upcoming',
      coordinates: { lat: 19.0825, lng: 72.8754 },
      employees: [
        {
          id: 'E009',
          name: 'Alice Green',
          phone: '+91 9912345686',
          pickupPoint: 'Coffee Shop F',
          status: 'pending',
          otp: '3456',
          pickupOrder: 1,
        },
        {
          id: 'E010',
          name: 'Bob White',
          phone: '+91 9912345687',
          pickupPoint: 'Library G',
          status: 'pending',
          otp: '7890',
          pickupOrder: 2,
        },
        {
          id: 'E011',
          name: 'Carol Black',
          phone: '+91 9912345688',
          pickupPoint: 'Market H',
          status: 'pending',
          otp: '1357',
          pickupOrder: 3,
        },
      ],
    },
    {
      id: 'TR003',
      source: 'Business Hub',
      destination: 'Central Station',
      date: '2025-01-26',
      startTime: '10:00 AM',
      status: 'completed',
      coordinates: { lat: 19.085, lng: 72.879 },
      employees: [
        {
          id: 'E012',
          name: 'Robert Lee',
          phone: '+91 9912345689',
          pickupPoint: 'Plaza A',
          status: 'picked',
          pickupOrder: 1,
        },
        {
          id: 'E013',
          name: 'Mary Johnson',
          phone: '+91 9912345690',
          pickupPoint: 'Avenue B',
          status: 'picked',
          pickupOrder: 2,
        },
        {
          id: 'E014',
          name: 'James Brown',
          phone: '+91 9912345691',
          pickupPoint: 'Square C',
          status: 'no_show',
          pickupOrder: 3,
        },
      ],
    },
  ]);

  const handleNavigation = (trip) => {
    const { lat, lng } = trip.coordinates;
    const destination = `${lat},${lng}`;

    Alert.alert('Open Navigation', 'Choose your preferred navigation app:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Google Maps',
        onPress: () => {
          const url =
            Platform.OS === 'ios'
              ? `comgooglemaps://?daddr=${destination}&directionsmode=driving`
              : `google.navigation:q=${destination}&mode=d`;
          Linking.openURL(url).catch(() => {
            Linking.openURL(
              `https://maps.google.com/maps?daddr=${destination}`
            );
          });
        },
      },
      {
        text: 'Apple Maps',
        onPress: () => {
          const url = `http://maps.apple.com/?daddr=${destination}&dirflg=d`;
          Linking.openURL(url);
        },
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'picked':
        return '#10B981';
      case 'no_show':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'picked':
        return <CheckCircle size={16} color="#10B981" />;
      case 'no_show':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#F59E0B" />;
    }
  };

  const toggleTripExpansion = (tripId) => {
    setExpandedTrips((prev) => ({
      ...prev,
      [tripId]: !prev[tripId],
    }));
  };

  const filteredTrips = trips.filter((trip) => trip.status === 'completed');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Completed Trips</Text>
        <Text style={styles.headerSubtitle}>
          View your completed pickups and routes
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTrips.length === 0 ? (
          <View style={styles.noTripsContainer}>
            <Text style={styles.noTripsText}>No completed trips found</Text>
          </View>
        ) : (
          filteredTrips.map((trip) => {
            const completedCount = trip.employees.filter(
              (emp) => emp.status === 'picked'
            ).length;
            const noShowCount = trip.employees.filter(
              (emp) => emp.status === 'no_show'
            ).length;

            return (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripId}>{trip.id}</Text>
                    <View style={styles.routeContainer}>
                      <Text style={styles.routeText}>{trip.source}</Text>
                      <ArrowRight size={16} color="#64748B" />
                      <Text style={styles.routeText}>{trip.destination}</Text>
                    </View>
                    <View style={styles.tripMeta}>
                      <Clock size={14} color="#64748B" />
                      <Text style={styles.tripTime}>{trip.startTime}</Text>
                    </View>
                  </View>
                  <View style={styles.tripActions}>
                    <TouchableOpacity
                      style={styles.navigationButton}
                      onPress={() => handleNavigation(trip)}
                    >
                      <Navigation size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(trip.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {trip.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            (completedCount / trip.employees.length) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {completedCount}/{trip.employees.length} completed
                    {noShowCount > 0 && ` • ${noShowCount} no-shows`}
                  </Text>
                </View>

                <View style={styles.employeesList}>
                  <TouchableOpacity
                    style={styles.employeesHeader}
                    onPress={() => toggleTripExpansion(trip.id)}
                  >
                    <Text style={styles.employeesTitle}>
                      All Pickups ({trip.employees.length})
                    </Text>
                    {expandedTrips[trip.id] ? (
                      <ChevronUp size={20} color="#1E293B" />
                    ) : (
                      <ChevronDown size={20} color="#1E293B" />
                    )}
                  </TouchableOpacity>

                  {expandedTrips[trip.id] && (
                    <View style={styles.employeesGrid}>
                      {trip.employees
                        .sort((a, b) => a.pickupOrder - b.pickupOrder)
                        .map((employee) => (
                          <View key={employee.id} style={styles.employeeItem}>
                            <View style={styles.employeeNumber}>
                              <Text style={styles.employeeNumberText}>
                                {employee.pickupOrder}
                              </Text>
                            </View>
                            <View style={styles.employeeInfo}>
                              <Text
                                style={styles.employeeName}
                                numberOfLines={1}
                              >
                                {employee.name}
                              </Text>
                              <Text
                                style={styles.employeeLocation}
                                numberOfLines={1}
                              >
                                {employee.pickupPoint}
                              </Text>
                            </View>
                            <View style={styles.employeeStatus}>
                              {getStatusIcon(employee.status)}
                            </View>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
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
    padding: 20,
    backgroundColor: '#2563EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noTripsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTripsText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripInfo: {
    flex: 1,
  },
  tripId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginHorizontal: 8,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripTime: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  tripActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  employeesList: {
    marginTop: 8,
  },
  employeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  employeesGrid: {
    gap: 8,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  employeeNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  employeeNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  employeeLocation: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  employeeStatus: {
    marginLeft: 8,
  },
});
