import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../../../services/notifications';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const createAppointment = async (
  date: string,
  selectedTime: string,
  selectedDoctor: { id: string; name: string; specialty: string },
  user: { id?: string; name?: string }
): Promise<void> => {
  if (!date || !selectedTime || !selectedDoctor) {
    throw new Error('Por favor, preencha a data e selecione um médico e horário');
  }

  // Recupera consultas existentes
  const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
  const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

  // Cria nova consulta
  const newAppointment: Appointment = {
    id: Date.now().toString(),
    patientId: user?.id || '',
    patientName: user?.name || '',
    doctorId: selectedDoctor.id,
    doctorName: selectedDoctor.name,
    date,
    time: selectedTime,
    specialty: selectedDoctor.specialty,
    status: 'pending',
  };

  // Adiciona nova consulta à lista
  appointments.push(newAppointment);

  // Salva lista atualizada
  await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

  await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);
};