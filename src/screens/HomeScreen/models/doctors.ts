// src/screens/HomeScreen/models/doctors.ts
import { Doctor } from '../../../types/doctors';
import { getProfileImage } from '../../../services/profileImages';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologista',
    image: getProfileImage('João Silva', 'doctor'),
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    image: getProfileImage('Maria Santos', 'doctor'),
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Oftalmologista',
    image: getProfileImage('Pedro Oliveira', 'doctor'),
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Pediatra',
    image: getProfileImage('Ana Costa', 'doctor'),
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Clínico Geral',
    image: getProfileImage('Carlos Mendes', 'doctor'),
  },
  {
    id: '6',
    name: 'Dra. Juliana Pereira',
    specialty: 'Ginecologista',
    image: getProfileImage('Juliana Pereira', 'doctor'),
  },
  {
    id: '7',
    name: 'Dr. Roberto Fernandes',
    specialty: 'Ortopedista',
    image: getProfileImage('Roberto Fernandes', 'doctor'),
  },
  {
    id: '8',
    name: 'Dra. Patrícia Lima',
    specialty: 'Endocrinologista',
    image: getProfileImage('Patrícia Lima', 'doctor'),
  },
];

export const getDoctorInfo = (doctorId: string): Doctor | undefined => {
  return mockDoctors.find(doctor => doctor.id === doctorId);
};

// Nova função para obter imagem de médico baseado no nome
export const getDoctorImage = (doctorName: string): string => {
  return getProfileImage(doctorName, 'doctor');
};