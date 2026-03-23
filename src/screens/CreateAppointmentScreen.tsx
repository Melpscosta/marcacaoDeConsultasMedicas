import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { saveAppointment, hasAppointmentAtSlot, getAvailableDatesForDoctor, getAvailableSlotsForDoctor } from '../services/storage';
import CalendarPicker from '../components/CalendarPicker';
import TimeSlotList from '../components/TimeSlotList';
import { Button, ScreenHeader } from '../components/ui';
import theme from '../styles/theme';
import type { RootStackParamList, Doctor, Appointment } from '../types';
import { MOCK_DOCTORS } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

function formatDate(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const loadAvailableDates = useCallback(async (doctorId: string) => {
    const dates = await getAvailableDatesForDoctor(doctorId);
    setAvailableDates(dates);
  }, []);

  const loadAvailableSlots = useCallback(async (doctorId: string, dateStr: string) => {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlotsForDoctor(doctorId, dateStr);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadAvailableDates(selectedDoctor.id);
      setSelectedDate(null);
      setSelectedTime(null);
    } else {
      setAvailableDates([]);
      setAvailableSlots([]);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [selectedDoctor, loadAvailableDates]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots(selectedDoctor.id, formatDate(selectedDate));
      setSelectedTime(null);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedDate, loadAvailableSlots]);

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleConfirm = async () => {
    if (!user) return;
    if (!selectedDate) {
      Alert.alert('Atenção', 'Selecione uma data');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Atenção', 'Selecione um horário');
      return;
    }
    if (!selectedDoctor) {
      Alert.alert('Atenção', 'Selecione um médico');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      Alert.alert('Atenção', 'Selecione uma data futura');
      return;
    }

    setErrorMessage(null);
    const dateStr = formatDate(selectedDate);
    const hasConflict = await hasAppointmentAtSlot(user.id, dateStr, selectedTime);
    if (hasConflict) {
      setErrorMessage(
        'Você já possui uma consulta agendada para esta data e horário. Por favor, escolha outro horário.',
      );
      return;
    }

    setLoading(true);
    try {
      const appointment: Appointment = {
        id: `apt_${Date.now()}`,
        doctor: selectedDoctor,
        patientId: user.id,
        patientName: user.name,
        patientEmail: user.email,
        date: dateStr,
        time: selectedTime,
        description: description.trim() || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await saveAppointment(appointment);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        goToHome();
      }, 2500);
    } catch {
      Alert.alert('Erro', 'Não foi possível agendar a consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <Icon name="checkmark-circle" type="ionicon" size={56} color={theme.colors.white} />
            <Text style={styles.successTitle}>Sua consulta foi confirmada!</Text>
            <Text style={styles.successText}>Você será redirecionado para a tela inicial.</Text>
          </View>
        </View>
      )}

      <ScreenHeader
        title="Agendar Consulta"
        variant="primary"
        onBack={() => navigation.goBack()}
        accessibilityLabel="Tela de agendamento de consulta"
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md),
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Selecione o médico</Text>
          {MOCK_DOCTORS.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              onPress={() => setSelectedDoctor(doc)}
              activeOpacity={0.7}
              style={[
                styles.doctorCard,
                selectedDoctor?.id === doc.id && styles.doctorCardSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedDoctor?.id === doc.id }}
              accessibilityLabel={`Selecionar ${doc.name}, ${doc.specialty}`}
            >
              <Image source={{ uri: doc.image }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doc.name}</Text>
                <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
              </View>
              {selectedDoctor?.id === doc.id && (
                <Icon name="checkmark-circle" type="ionicon" size={24} color={theme.colors.success} />
              )}
            </TouchableOpacity>
          ))}

          {selectedDoctor && (
            <>
              <Text style={styles.sectionTitle}>2. Selecione a data</Text>
              <CalendarPicker
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                minDate={new Date()}
                availableDates={availableDates}
              />

              <Text style={styles.sectionTitle}>3. Selecione o horário</Text>
              {loadingSlots && selectedDate ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.loadingText}>Carregando horários...</Text>
                </View>
              ) : (
                <TimeSlotList
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  slots={availableSlots}
                />
              )}
            </>
          )}

          {selectedDoctor && (
            <>
              <Text style={styles.sectionTitle}>4. Observações (opcional)</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Descreva o motivo da consulta..."
                placeholderTextColor={theme.colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                accessibilityLabel="Campo de observações da consulta"
              />
            </>
          )}

          {!selectedDoctor && (
            <Text style={styles.hintText}>Selecione um médico para ver as datas e horários disponíveis.</Text>
          )}

          {errorMessage && (
            <View style={styles.errorBox}>
              <View style={styles.errorRow}>
                <Icon name="close-circle" type="ionicon" size={24} color={theme.colors.white} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setErrorMessage(null)}
                style={styles.dismissError}
                accessibilityRole="button"
                accessibilityLabel="Fechar mensagem de erro"
              >
                <Text style={styles.dismissText}>Entendi</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedDoctor && selectedDate && selectedTime && (
            <Button
              onPress={handleConfirm}
              loading={loading}
              variant="secondary"
              fullWidth
              style={{ marginTop: theme.spacing.lg }}
              accessibilityLabel="Confirmar agendamento da consulta"
            >
              Confirmar Agendamento
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  doctorCardSelected: {
    borderColor: theme.colors.primary,
  },
  doctorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  doctorSpecialty: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textMuted,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: 8,
  },
  loadingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textMuted,
  },
  hintText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  descriptionInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: 14,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    minHeight: 80,
  },
  errorBox: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.white,
  },
  dismissError: {
    marginTop: theme.spacing.md,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: theme.radius.sm,
    alignSelf: 'center',
  },
  dismissText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.white,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successBox: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    alignItems: 'center',
    minWidth: 280,
  },
  successTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: '700',
    color: theme.colors.white,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  successText: {
    fontSize: theme.typography.body.fontSize,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default CreateAppointmentScreen;
