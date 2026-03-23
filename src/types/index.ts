// Tipos de navegação
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CreateAppointment: undefined;
  Profile: undefined;
  AppointmentDetail: { appointmentId: string };
  DoctorHome: undefined;
  DoctorAppointmentDetail: { appointmentId: string };
  DoctorProfile: undefined;
};

// Roles de usuário
export type UserRole = 'patient' | 'doctor';

// Status de consulta
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

// Médico
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Consulta
export interface Appointment {
  id: string;
  doctor: Doctor;
  patientId: string;
  patientName?: string;
  patientEmail?: string;
  date: string;
  time: string;
  description?: string;
  status: AppointmentStatus;
  createdAt: string;
}

// Mensagem (médico-paciente)
export interface Message {
  id: string;
  appointmentId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

// Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  healthPlan?: string;
  role?: UserRole;
}

// Horários disponíveis
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

// Médicos de demonstração (com imagens Unsplash profissionais)
export const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop' },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Pediatria', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Ortopedia', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop' },
  { id: '4', name: 'Dra. Ana Costa', specialty: 'Dermatologia', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop' },
];
