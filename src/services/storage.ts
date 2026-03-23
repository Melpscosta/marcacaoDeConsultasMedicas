import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Appointment, Message } from '../types';

const APPOINTMENTS_KEY = '@HealthConnect:appointments';
const AVAILABILITY_KEY = '@HealthConnect:doctorAvailability';
const MESSAGES_KEY = '@HealthConnect:messages';

function formatDate(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Gera horários de disponibilidade pré-definidos para demonstração
function getDefaultDoctorAvailability(): { doctorId: string; date: string; time: string }[] {
  const slots: { doctorId: string; date: string; time: string }[] = [];
  const times = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = formatDate(d);
    ['1', '2', '3', '4'].forEach((doctorId) => {
      times.forEach((time) => slots.push({ doctorId, date: dateStr, time }));
    });
  }
  return slots;
}

async function ensureAvailabilityInitialized(): Promise<void> {
  const stored = await AsyncStorage.getItem(AVAILABILITY_KEY);
  if (!stored) {
    const defaultSlots = getDefaultDoctorAvailability();
    await AsyncStorage.setItem(AVAILABILITY_KEY, JSON.stringify(defaultSlots));
  }
}

function normalizeDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const [d, m, y] = parts;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
}

export async function getAvailableSlotsForDoctor(
  doctorId: string,
  date: string
): Promise<string[]> {
  await ensureAvailabilityInitialized();
  const [storedAvail, storedApts] = await Promise.all([
    AsyncStorage.getItem(AVAILABILITY_KEY),
    AsyncStorage.getItem(APPOINTMENTS_KEY),
  ]);
  const availability: { doctorId: string; date: string; time: string }[] = storedAvail
    ? JSON.parse(storedAvail)
    : [];
  const appointments: Appointment[] = storedApts ? JSON.parse(storedApts) : [];
  const normDate = normalizeDate(date);
  const availableTimes = availability
    .filter((s) => s.doctorId === doctorId && normalizeDate(s.date) === normDate)
    .map((s) => s.time);
  const bookedTimes = appointments
    .filter(
      (a) =>
        a.doctor.id === doctorId &&
        normalizeDate(a.date) === normDate &&
        a.status !== 'cancelled'
    )
    .map((a) => a.time);
  return [...new Set(availableTimes)].filter((t) => !bookedTimes.includes(t)).sort();
}

export async function getAvailableDatesForDoctor(doctorId: string): Promise<string[]> {
  await ensureAvailabilityInitialized();
  const [storedAvail, storedApts] = await Promise.all([
    AsyncStorage.getItem(AVAILABILITY_KEY),
    AsyncStorage.getItem(APPOINTMENTS_KEY),
  ]);
  const availability: { doctorId: string; date: string; time: string }[] = storedAvail
    ? JSON.parse(storedAvail)
    : [];
  const appointments: Appointment[] = storedApts ? JSON.parse(storedApts) : [];
  const datesWithSlots = [...new Set(availability.filter((s) => s.doctorId === doctorId).map((s) => normalizeDate(s.date)))];
  const today = formatDate(new Date());
  return datesWithSlots
    .filter((d) => {
      const [dd, mm, yy] = d.split('/').map(Number);
      const slotDate = new Date(yy, mm - 1, dd);
      const minDate = new Date();
      minDate.setHours(0, 0, 0, 0);
      return slotDate >= minDate;
    })
    .sort();
}

export async function getAppointments(userId: string): Promise<Appointment[]> {
  try {
    const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return [];
    const all: Appointment[] = JSON.parse(stored);
    const userAppointments = all.filter((a) => a.patientId === userId);
    userAppointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return userAppointments;
  } catch {
    return [];
  }
}

export async function getAppointmentsForDoctor(doctorId: string): Promise<Appointment[]> {
  try {
    const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return [];
    const all: Appointment[] = JSON.parse(stored);
    const doctorApts = all.filter((a) => a.doctor.id === doctorId && a.status !== 'cancelled');
    doctorApts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return doctorApts;
  } catch {
    return [];
  }
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  try {
    const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return null;
    const all: Appointment[] = JSON.parse(stored);
    return all.find((a) => a.id === id) || null;
  } catch {
    return null;
  }
}

export async function hasAppointmentAtSlot(userId: string, date: string, time: string): Promise<boolean> {
  try {
    const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return false;
    const all: Appointment[] = JSON.parse(stored);
    const normalizedDate = normalizeDate(date);
    return all.some((a) => {
      if (a.patientId !== userId || a.status === 'cancelled') return false;
      const storedNormalized = normalizeDate(a.date);
      return storedNormalized === normalizedDate && a.time === time;
    });
  } catch {
    return false;
  }
}

export async function saveAppointment(appointment: Appointment): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    const all: Appointment[] = stored ? JSON.parse(stored) : [];
    all.push(appointment);
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
  } catch {
    throw new Error('Erro ao salvar consulta');
  }
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return;
    const all: Appointment[] = JSON.parse(stored);
    const idx = all.findIndex((a) => a.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], status };
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
    }
  } catch {
    throw new Error('Erro ao atualizar consulta');
  }
}

export async function getMessages(appointmentId: string): Promise<Message[]> {
  try {
    const stored = await AsyncStorage.getItem(MESSAGES_KEY);
    if (!stored) return [];
    const all: Message[] = JSON.parse(stored);
    return all.filter((m) => m.appointmentId === appointmentId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function addMessage(message: Message): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(MESSAGES_KEY);
    const all: Message[] = stored ? JSON.parse(stored) : [];
    all.push(message);
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  } catch {
    throw new Error('Erro ao enviar mensagem');
  }
}
