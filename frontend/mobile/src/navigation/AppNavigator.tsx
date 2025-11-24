import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/LoadingOverlay';
import TabBarIcon from '@/components/TabBarIcon';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import EventListScreen from '@/screens/events/EventListScreen';
import EventDetailScreen from '@/screens/events/EventDetailScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import QrScannerScreen from '@/screens/qr/QrScannerScreen';
import { useTheme } from '@/contexts/ThemeContext';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const EventsStack = createNativeStackNavigator();

const EventsNavigator = () => (
  <EventsStack.Navigator screenOptions={{ headerShown: false }}>
    <EventsStack.Screen name="EventList" component={EventListScreen} />
    <EventsStack.Screen name="EventDetail" component={EventDetailScreen} />
  </EventsStack.Navigator>
);

const MainNavigator = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          height: 72
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="home-outline" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Events"
        component={EventsNavigator}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="calendar-outline" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Scanner"
        component={QrScannerScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="qr-code" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="notifications-outline" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="person-circle-outline" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay message="Autenticando" />;
  }

  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    );
  }

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Main" component={MainNavigator} />
      <AuthStack.Screen name="Settings" component={SettingsScreen} />
    </AuthStack.Navigator>
  );
};

export default AppNavigator;
