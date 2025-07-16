import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Building2,
  CircleCheck as CheckCircle,
} from 'lucide-react-native';

export default function Office() {
  const [currentOffice, setCurrentOffice] = useState('office1');
  const [offices] = useState([
    {
      id: 'office1',
      name: 'Office Complex A',
      address: 'Plot No. 123, Tech Park, Sector 5, Mumbai',
      phone: '+91 22 1234 5678',
      distance: '0.5 km',
      isActive: true,
      workingHours: '7:00 AM - 10:00 PM',
      coordinates: { lat: 19.076, lng: 72.8777 },
    },
    {
      id: 'office2',
      name: 'City Center Branch',
      address: 'Floor 12, Business Tower, Downtown, Mumbai',
      phone: '+91 22 2345 6789',
      distance: '2.3 km',
      isActive: false,
      workingHours: '6:00 AM - 11:00 PM',
      coordinates: { lat: 19.0825, lng: 72.8754 },
    },
    {
      id: 'office3',
      name: 'Airport Hub',
      address: 'Terminal 2, International Airport, Mumbai',
      phone: '+91 22 3456 7890',
      distance: '8.7 km',
      isActive: false,
      workingHours: '24/7',
      coordinates: { lat: 19.0896, lng: 72.8656 },
    },
  ]);

  const handleSwitchOffice = (officeId) => {
    Alert.alert(
      'Switch Office',
      'Are you sure you want to switch to this office? This will affect your trip assignments.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: () => {
            setCurrentOffice(officeId);
            Alert.alert('Success', 'Office switched successfully!');
          },
        },
      ]
    );
  };

  const handleNavigate = (office) => {
    Alert.alert('Navigate to Office', `Opening navigation to ${office.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Maps', onPress: () => console.log('Opening maps...') },
    ]);
  };

  const handleCallOffice = (phone) => {
    Alert.alert('Call Office', `Do you want to call ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Calling...') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Office Management</Text>
        <Text style={styles.headerSubtitle}>Switch offices and navigate</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Office Card */}
        <View style={styles.currentOfficeCard}>
          <View style={styles.currentOfficeHeader}>
            <View style={styles.currentOfficeIcon}>
              <Building2 size={24} color="#10B981" />
            </View>
            <View style={styles.currentOfficeInfo}>
              <Text style={styles.currentOfficeLabel}>Current Office</Text>
              <Text style={styles.currentOfficeName}>
                {offices.find((o) => o.id === currentOffice)?.name}
              </Text>
            </View>
          </View>

          <View style={styles.currentOfficeDetails}>
            <View style={styles.detailItem}>
              <MapPin size={16} color="#64748B" />
              <Text style={styles.detailText}>
                {offices.find((o) => o.id === currentOffice)?.address}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.detailText}>
                {offices.find((o) => o.id === currentOffice)?.workingHours}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.navigateButton}
            onPress={() =>
              handleNavigate(offices.find((o) => o.id === currentOffice))
            }
          >
            <Navigation size={20} color="#FFFFFF" />
            <Text style={styles.navigateButtonText}>Navigate to Office</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() =>
                handleCallOffice(
                  offices.find((o) => o.id === currentOffice)?.phone
                )
              }
            >
              <Phone size={24} color="#2563EB" />
              <Text style={styles.quickActionText}>Call Office</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Clock size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Check Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <MapPin size={24} color="#F59E0B" />
              <Text style={styles.quickActionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Offices */}
        <View style={styles.officesCard}>
          <Text style={styles.cardTitle}>Available Offices</Text>
          {offices.map((office) => (
            <View key={office.id} style={styles.officeItem}>
              <View style={styles.officeHeader}>
                <View style={styles.officeInfo}>
                  <Text style={styles.officeName}>{office.name}</Text>
                  <View style={styles.officeMetaRow}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.officeDistance}>{office.distance}</Text>
                    {office.id === currentOffice && (
                      <View style={styles.activeIndicator}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.activeText}>Active</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.officeActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleNavigate(office)}
                  >
                    <Navigation size={16} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCallOffice(office.phone)}
                  >
                    <Phone size={16} color="#10B981" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.officeAddress}>{office.address}</Text>

              <View style={styles.officeDetails}>
                <View style={styles.detailItem}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.detailText}>{office.workingHours}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Phone size={14} color="#64748B" />
                  <Text style={styles.detailText}>{office.phone}</Text>
                </View>
              </View>

              {office.id !== currentOffice && (
                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => handleSwitchOffice(office.id)}
                >
                  <Text style={styles.switchButtonText}>
                    Switch to This Office
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
  currentOfficeCard: {
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
  currentOfficeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentOfficeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currentOfficeInfo: {
    flex: 1,
  },
  currentOfficeLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  currentOfficeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  currentOfficeDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActionsCard: {
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
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '30%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  officesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  officeItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  officeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  officeInfo: {
    flex: 1,
  },
  officeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  officeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  officeDistance: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  activeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  officeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  officeAddress: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  officeDetails: {
    marginBottom: 12,
  },
  switchButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
