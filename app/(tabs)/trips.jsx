import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  MapPin,
  Clock,
  User,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  Phone,
  Navigation,
  ArrowRight,
} from 'lucide-react-native';

export default function Trips() {
  const [activeTab, setActiveTab] = useState(
    'upcoming' | 'active' | ('completed' > 'active')
  );
  const [otpInput, setOtpInput] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
          phone: '+91 9876543210',
          pickupPoint: 'Metro Station A',
          status: 'picked',
          pickupOrder: 1,
        },
        {
          id: 'E002',
          name: 'Jane Smith',
          phone: '+91 9876543211',
          pickupPoint: 'Bus Stop B',
          status: 'picked',
          pickupOrder: 2,
        },
        {
          id: 'E003',
          name: 'Mike Johnson',
          phone: '+91 9876543212',
          pickupPoint: 'Mall C',
          status: 'pending',
          otp: '1234',
          pickupOrder: 3,
        },
        {
          id: 'E004',
          name: 'Sarah Wilson',
          phone: '+91 9876543213',
          pickupPoint: 'Park D',
          status: 'pending',
          otp: '5678',
          pickupOrder: 4,
        },
        {
          id: 'E005',
          name: 'Tom Brown',
          phone: '+91 9876543214',
          pickupPoint: 'School E',
          status: 'pending',
          otp: '9012',
          pickupOrder: 5,
        },
        {
          id: 'E006',
          name: 'Lisa Davis',
          phone: '+91 9876543215',
          pickupPoint: 'Hospital F',
          status: 'pending',
          otp: '3456',
          pickupOrder: 6,
        },
        {
          id: 'E007',
          name: 'David Miller',
          phone: '+91 9876543216',
          pickupPoint: 'Library G',
          status: 'pending',
          otp: '7890',
          pickupOrder: 7,
        },
        {
          id: 'E008',
          name: 'Emma Wilson',
          phone: '+91 9876543217',
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
          phone: '+91 9876543218',
          pickupPoint: 'Coffee Shop F',
          status: 'pending',
          otp: '3456',
          pickupOrder: 1,
        },
        {
          id: 'E010',
          name: 'Bob White',
          phone: '+91 9876543219',
          pickupPoint: 'Library G',
          status: 'pending',
          otp: '7890',
          pickupOrder: 2,
        },
        {
          id: 'E011',
          name: 'Carol Black',
          phone: '+91 9876543220',
          pickupPoint: 'Market H',
          status: 'pending',
          otp: '1357',
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

  const getCurrentEmployee = (employees) => {
    const sortedEmployees = employees.sort(
      (a, b) => a.pickupOrder - b.pickupOrder
    );
    return sortedEmployees.find((emp) => emp.status === 'pending');
  };

  const handleOtpSubmit = (employee) => {
    if (otpInput === employee.otp) {
      setTrips((prevTrips) =>
        prevTrips.map((trip) => ({
          ...trip,
          employees: trip.employees.map((emp) =>
            emp.id === employee.id ? { ...emp, status: 'picked' } : emp
          ),
        }))
      );
      setOtpInput('');
      setSelectedEmployee(null);
      Alert.alert(
        'Success',
        `${employee.name} has been picked up successfully!`
      );
    } else {
      Alert.alert(
        'Invalid OTP',
        'Please enter the correct OTP provided by the employee.'
      );
    }
  };

  const handleNoShow = (employee) => {
    Alert.alert(
      'Mark as No Show',
      `Are you sure ${employee.name} is a no-show?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setTrips((prevTrips) =>
              prevTrips.map((trip) => ({
                ...trip,
                employees: trip.employees.map((emp) =>
                  emp.id === employee.id ? { ...emp, status: 'no_show' } : emp
                ),
              }))
            );
            setSelectedEmployee(null);
            setOtpInput('');
          },
        },
      ]
    );
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

  const filteredTrips = trips.filter((trip) => trip.status === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Management</Text>
        <Text style={styles.headerSubtitle}>Track your pickups and routes</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['upcoming', 'active', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTrips.map((trip) => {
          const currentEmployee = getCurrentEmployee(trip.employees);
          const completedCount = trip.employees.filter(
            (emp) => emp.status === 'picked'
          ).length;
          const noShowCount = trip.employees.filter(
            (emp) => emp.status === 'no_show'
          ).length;

          return (
            <View key={trip.id} style={styles.tripCard}>
              {/* Trip Header */}
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

              {/* Progress Bar */}
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

              {/* Current Employee (if active trip) */}
              {currentEmployee && trip.status === 'active' && (
                <View style={styles.currentEmployeeCard}>
                  <View style={styles.currentEmployeeHeader}>
                    <Text style={styles.currentEmployeeLabel}>Next Pickup</Text>
                    <Text style={styles.pickupOrder}>
                      #{currentEmployee.pickupOrder}
                    </Text>
                  </View>

                  <Text style={styles.currentEmployeeName}>
                    {currentEmployee.name}
                  </Text>
                  <View style={styles.currentEmployeeDetails}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.currentEmployeeLocation}>
                      {currentEmployee.pickupPoint}
                    </Text>
                  </View>
                  <View style={styles.currentEmployeeDetails}>
                    <Phone size={14} color="#64748B" />
                    <Text style={styles.currentEmployeePhone}>
                      {currentEmployee.phone}
                    </Text>
                  </View>

                  {selectedEmployee?.id === currentEmployee.id ? (
                    <View style={styles.otpContainer}>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="Enter OTP"
                        value={otpInput}
                        onChangeText={setOtpInput}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      <TouchableOpacity
                        style={styles.otpSubmitButton}
                        onPress={() => handleOtpSubmit(currentEmployee)}
                      >
                        <Text style={styles.otpSubmitText}>Verify</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.pickupButton}
                        onPress={() => setSelectedEmployee(currentEmployee)}
                      >
                        <Text style={styles.pickupButtonText}>Enter OTP</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.noShowButton}
                        onPress={() => handleNoShow(currentEmployee)}
                      >
                        <Text style={styles.noShowButtonText}>No Show</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* All Employees List (Compact) */}
              <View style={styles.employeesList}>
                <TouchableOpacity style={styles.employeesHeader}>
                  <Text style={styles.employeesTitle}>
                    All Pickups ({trip.employees.length})
                  </Text>
                </TouchableOpacity>

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
                          <Text style={styles.employeeName} numberOfLines={1}>
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
              </View>
            </View>
          );
        })}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
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
  currentEmployeeCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  currentEmployeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentEmployeeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  pickupOrder: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  currentEmployeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  currentEmployeeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentEmployeeLocation: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  currentEmployeePhone: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  otpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  otpSubmitButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  otpSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  pickupButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickupButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noShowButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  noShowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  employeesList: {
    marginTop: 8,
  },
  employeesHeader: {
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
