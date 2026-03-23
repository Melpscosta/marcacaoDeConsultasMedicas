import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentsForDoctor } from '../services/storage';
import StatusBadge from '../components/StatusBadge';
import { Card } from '../components/ui';
import theme from '../styles/theme';
import type { Appointment, RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DoctorHomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorHome'>;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const DoctorHomeScreen: React.FC<DoctorHomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!user) return;
    const list = await getAppointmentsForDoctor(user.id);
    setAppointments(list);
  }, [user]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAppointments);
    loadAppointments();
    return unsubscribe;
  }, [loadAppointments, navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const doctorName = user?.name?.replace(/^Dr\.? /, '').replace(/^Dra\.? /, '') || '';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md, paddingBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.md }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.logo}>HealthConnect</Text>
            <Text style={styles.greeting}>{getGreeting()}, {doctorName}!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile')} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Abrir perfil">
            <Icon name="person" type="ionicon" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.statsRow, { paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md) }]}>
        <View style={[styles.statCard, theme.shadows.md]}>
          <Text style={styles.statNumber}>{appointments.length}</Text>
          <Text style={styles.statLabel}>Consultas</Text>
        </View>
        <View style={[styles.statCard, theme.shadows.md]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      <View style={[styles.content, { paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md), paddingBottom: insets.bottom + theme.spacing.lg }]}>
        <Text style={styles.sectionTitle}>Minha agenda</Text>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              onPress={() => navigation.navigate('DoctorAppointmentDetail', { appointmentId: item.id })}
              style={styles.appointmentCard}
              accessibilityLabel={`Consulta com ${item.patientName}, ${item.date} às ${item.time}`}
            >
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{item.patientName || 'Paciente'}</Text>
                <Text style={styles.dateTime}>{item.date} - {item.time}</Text>
                <View style={styles.statusRow}>
                  <StatusBadge status={item.status} />
                </View>
              </View>
              <Icon name="chevron-forward" type="ionicon" size={22} color={theme.colors.textMuted} />
            </Card>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma consulta agendada.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: theme.spacing.xl }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { backgroundColor: theme.colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { fontSize: theme.typography.small.fontSize, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  greeting: { fontSize: theme.typography.h1.fontSize, fontWeight: '700', color: theme.colors.white },
  iconButton: { width: theme.touchTarget, height: theme.touchTarget, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', marginTop: -theme.spacing.md, gap: theme.spacing.md },
  statCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.md },
  statNumber: { fontSize: 24, fontWeight: '700', color: theme.colors.primary },
  statLabel: { fontSize: theme.typography.small.fontSize, color: theme.colors.textMuted, marginTop: 4 },
  content: { flex: 1, paddingTop: theme.spacing.md },
  sectionTitle: { fontSize: theme.typography.h3.fontSize, fontWeight: '600', color: theme.colors.text, marginBottom: theme.spacing.md },
  appointmentCard: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  patientInfo: { flex: 1, minWidth: 0 },
  patientName: { fontSize: theme.typography.h3.fontSize, fontWeight: '600', color: theme.colors.text },
  dateTime: { fontSize: theme.typography.body.fontSize, color: theme.colors.primary, marginTop: 4 },
  statusRow: { flexDirection: 'row', marginTop: 8 },
  emptyText: { textAlign: 'center', color: theme.colors.textMuted, marginTop: theme.spacing.xl },
});

export default DoctorHomeScreen;
