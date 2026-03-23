import { getProfileImage } from '../../../services/profileImages';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Lista de médicos disponíveis com imagens fixas e consistentes
export const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    image: getProfileImage('João Silva', 'doctor'),
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Pediatria',
    image: getProfileImage('Maria Santos', 'doctor'),
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
    image: getProfileImage('Pedro Oliveira', 'doctor'),
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Dermatologia',
    image: getProfileImage('Ana Costa', 'doctor'),
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Oftalmologia',
    image: getProfileImage('Carlos Mendes', 'doctor'),
  },
  {
    id: '6',
    name: 'Dra. Juliana Pereira',
    specialty: 'Ginecologia',
    image: getProfileImage('Juliana Pereira', 'doctor'),
  },
  {
    id: '7',
    name: 'Dr. Roberto Fernandes',
    specialty: 'Clínico Geral',
    image: getProfileImage('Roberto Fernandes', 'doctor'),
  },
  {
    id: '8',
    name: 'Dra. Patrícia Lima',
    specialty: 'Endocrinologia',
    image: getProfileImage('Patrícia Lima', 'doctor'),
  },
  {
    id: '9',
    name: 'Dr. Marcos Barbosa',
    specialty: 'Neurologia',
    image: getProfileImage('Marcos Barbosa', 'doctor'),
  },
  {
    id: '10',
    name: 'Dra. Fabiana Dias',
    specialty: 'Psiquiatria',
    image: getProfileImage('Fabiana Dias', 'doctor'),
  },
];

// Função para obter informações do médico pelo ID
export const getDoctorById = (id: string): Doctor | undefined => {
  return availableDoctors.find(doctor => doctor.id === id);
};

// Função para obter imagem do médico pelo nome
export const getDoctorImageByName = (name: string): string => {
  return getProfileImage(name, 'doctor');
};