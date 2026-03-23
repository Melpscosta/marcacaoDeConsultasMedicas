import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { getAppointments, updateAppointmentStatus } from '../services/storage';
import StatusBadge from '../components/StatusBadge';
import { Card } from '../components/ui';
import theme from '../styles/theme';
import type { Appointment, RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!user) return;
    const list = await getAppointments(user.id);
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

  const handleCancel = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'cancelled');
      await loadAppointments();
    } catch {
      // ignore
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Usuário';
  const scheduledCount = appointments.filter((a) => a.status !== 'cancelled').length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + theme.spacing.md,
            paddingBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.md,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.logo}>HealthConnect</Text>
            <Text style={styles.greeting}>
              {getGreeting()}, {firstName}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
          >
            <Icon name="person" type="ionicon" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.statsRow,
          {
            paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md),
          },
        ]}
      >
        <View style={[styles.statCard, theme.shadows.md]}>
          <Text style={styles.statNumber}>{scheduledCount}</Text>
          <Text style={styles.statLabel}>Consultas agendadas</Text>
        </View>
        <View style={[styles.statCard, theme.shadows.md]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      <View
        style={[
          styles.content,
          {
            paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md),
            paddingBottom: insets.bottom + theme.spacing.lg,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateAppointment')}
          style={styles.actionButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Agendar nova consulta"
        >
          <Icon name="add" type="ionicon" size={24} color={theme.colors.white} />
          <Text style={styles.actionButtonText}>Agendar Nova Consulta</Text>
        </TouchableOpacity>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
              style={styles.appointmentCard}
              accessibilityLabel={`Consulta com ${item.doctor.name}, ${item.date} às ${item.time}`}
            >
              <Image source={{ uri: item.doctor.image }} style={styles.doctorImage} />
              <View style={styles.appointmentInfo}>
                <Text style={styles.doctorName}>{item.doctor.name}</Text>
                <Text style={styles.specialty}>{item.doctor.specialty}</Text>
                <Text style={styles.dateTime}>
                  {item.date} - {item.time}
                </Text>
                <View style={styles.statusRow}>
                  <StatusBadge status={item.status} />
                  {item.status !== 'cancelled' && (
                    <TouchableOpacity
                      onPress={() => handleCancel(item.id)}
                      style={styles.cancelButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Cancelar consulta com ${item.doctor.name}`}
                    >
                      <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma consulta agendada. Toque em "Agendar Nova Consulta" para começar.
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: theme.spacing.xl }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    fontSize: theme.typography.small.fontSize,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  greeting: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: '700',
    color: theme.colors.white,
  },
  iconButton: {
    width: theme.touchTarget,
    height: theme.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: -theme.spacing.md,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    minHeight: theme.touchTarget,
  },
  actionButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.white,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  doctorImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.md,
  },
  appointmentInfo: {
    flex: 1,
    minWidth: 0,
  },
  doctorName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textMuted,
  },
  dateTime: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.error,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
  },
});

export default HomeScreen;
