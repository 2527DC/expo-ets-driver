import { Tabs } from 'expo-router';
import { Truck, MapPin, User, Building2 } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="upcomingTrip"
        options={{
          title: 'Upcoming',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ size, color }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="completedTrip"
        options={{
          title: 'Completed',
          tabBarIcon: ({ size, color }) => <Truck size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
