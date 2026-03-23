import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DoctorHomeScreen from '../screens/DoctorHomeScreen';
import DoctorAppointmentDetailScreen from '../screens/DoctorAppointmentDetailScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import theme from '../styles/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function PatientStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    </Stack.Navigator>
  );
}

function DoctorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
      <Stack.Screen name="DoctorAppointmentDetail" component={DoctorAppointmentDetailScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}
        accessibilityLabel="Carregando aplicação"
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) return <AuthStack />;
  if (user.role === 'doctor') return <DoctorStack />;
  return <PatientStack />;
}
