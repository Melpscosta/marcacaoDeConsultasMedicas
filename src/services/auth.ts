import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { getProfileImage } from './profileImages';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
  REGISTERED_USERS: '@MedicalApp:registeredUsers',
};

// Médicos mockados que podem fazer login
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. João Silva',
    email: 'joao@example.com',
    role: 'doctor' as const,
    specialty: 'Cardiologia',
    image: getProfileImage('João Silva', 'doctor'),
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    email: 'maria@example.com',
    role: 'doctor' as const,
    specialty: 'Pediatria',
    image: getProfileImage('Maria Santos', 'doctor'),
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    email: 'pedro@example.com',
    role: 'doctor' as const,
    specialty: 'Ortopedia',
    image: getProfileImage('Pedro Oliveira', 'doctor'),
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    email: 'ana.doctor@example.com',
    role: 'doctor' as const,
    specialty: 'Dermatologia',
    image: getProfileImage('Ana Costa', 'doctor'),
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    email: 'carlos.doctor@example.com',
    role: 'doctor' as const,
    specialty: 'Clínico Geral',
    image: getProfileImage('Carlos Mendes', 'doctor'),
  },
];

// Admin mockado
const mockAdmin = {
  id: 'admin',
  name: 'Administrador',
  email: 'admin@example.com',
  role: 'admin' as const,
  image: getProfileImage('Administrador', 'user'),
};

// Lista de usuários cadastrados (pacientes)
let registeredUsers: (User & { password: string })[] = [
  // Pacientes de exemplo para testes
  {
    id: 'patient-example-1',
    name: 'Ana Paciente',
    email: 'ana@exemplo.com',
    role: 'patient' as const,
    image: getProfileImage('Ana Paciente', 'patient'),
    password: '123456',
  },
  {
    id: 'patient-example-2',
    name: 'Carlos Paciente',
    email: 'carlos@exemplo.com',
    role: 'patient' as const,
    image: getProfileImage('Carlos Paciente', 'patient'),
    password: '123456',
  },
  {
    id: 'patient-example-3',
    name: 'Maria Paciente',
    email: 'maria@exemplo.com',
    role: 'patient' as const,
    image: getProfileImage('Maria Paciente', 'patient'),
    password: '123456',
  },
  {
    id: 'patient-test-1',
    name: 'João Teste',
    email: 'teste@paciente.com',
    role: 'patient' as const,
    image: getProfileImage('João Teste', 'patient'),
    password: '123456',
  },
  {
    id: 'patient-test-2',
    name: 'Pedro Usuário',
    email: 'pedro@usuario.com',
    role: 'patient' as const,
    image: getProfileImage('Pedro Usuário', 'patient'),
    password: '123456',
  }
];

export const authService = {
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    // Verifica se é o admin
    if (credentials.email === mockAdmin.email && credentials.password === '123456') {
      return {
        user: mockAdmin,
        token: 'admin-token',
      };
    }

    // Verifica se é um médico
    const doctor = mockDoctors.find(
      (d) => d.email === credentials.email && credentials.password === '123456'
    );
    if (doctor) {
      return {
        user: doctor,
        token: `doctor-token-${doctor.id}`,
      };
    }

    // Verifica se é um paciente registrado
    const patient = registeredUsers.find(
      (p) => p.email === credentials.email
    );
    if (patient) {
      // Verifica a senha do paciente
      if (credentials.password === patient.password) {
        // Remove a senha do objeto antes de retornar
        const { password, ...patientWithoutPassword } = patient;
        return {
          user: patientWithoutPassword,
          token: `patient-token-${patient.id}`,
        };
      }
    }

    throw new Error('Email ou senha inválidos');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Verifica se o email já está em uso
    if (
      mockDoctors.some((d) => d.email === data.email) ||
      mockAdmin.email === data.email ||
      registeredUsers.some((u) => u.email === data.email)
    ) {
      throw new Error('Email já está em uso');
    }

    // Cria um novo paciente
    const newPatient: User & { password: string } = {
      id: `patient-${registeredUsers.length + 4}`,
      name: data.name,
      email: data.email,
      role: 'patient' as const,
      image: getProfileImage(data.name, 'patient'),
      password: data.password,
    };

    registeredUsers.push(newPatient);

    // Salva a lista atualizada de usuários
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));

    // Remove a senha do objeto antes de retornar
    const { password, ...patientWithoutPassword } = newPatient;
    return {
      user: patientWithoutPassword,
      token: `patient-token-${newPatient.id}`,
    };
  },

  async signOut(): Promise<void> {
    // Limpa os dados do usuário do AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário armazenado:', error);
      return null;
    }
  },

  // Funções para o admin
  async getAllUsers(): Promise<User[]> {
    return [...mockDoctors, ...registeredUsers];
  },

  async getAllDoctors(): Promise<User[]> {
    return mockDoctors;
  },

  async getPatients(): Promise<User[]> {
    return registeredUsers;
  },

  // Função para carregar usuários registrados ao iniciar o app
  async loadRegisteredUsers(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (usersJson) {
        registeredUsers = JSON.parse(usersJson);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  },
}; 