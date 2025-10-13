/**
 * Serviço para gerenciamento de imagens de perfil
 * Fornece URLs fixas e consistentes para médicos e pacientes
 */

// URLs de imagens para médicos (profissionais de saúde)
export const DOCTOR_IMAGES = {
  // Cardiologistas
  'dr-joao-silva': 'https://randomuser.me/api/portraits/men/32.jpg',
  'dr-carlos-mendes': 'https://randomuser.me/api/portraits/men/45.jpg',
  'dra-ana-costa': 'https://randomuser.me/api/portraits/women/28.jpg',

  // Pediatras
  'dra-maria-santos': 'https://randomuser.me/api/portraits/women/44.jpg',
  'dr-pedro-almeida': 'https://randomuser.me/api/portraits/men/22.jpg',
  'dra-juliana-pereira': 'https://randomuser.me/api/portraits/women/36.jpg',

  // Clínicos gerais
  'dr-roberto-fernandes': 'https://randomuser.me/api/portraits/men/54.jpg',
  'dra-patricia-lima': 'https://randomuser.me/api/portraits/women/42.jpg',
  'dr-luis-oliveira': 'https://randomuser.me/api/portraits/men/38.jpg',

  // Ortopedistas
  'dr-marcos-barbosa': 'https://randomuser.me/api/portraits/men/48.jpg',
  'dra-fabiana-dias': 'https://randomuser.me/api/portraits/women/31.jpg',

  // Dermatologistas
  'dra-camila-rocha': 'https://randomuser.me/api/portraits/women/26.jpg',
  'dr-thiago-martins': 'https://randomuser.me/api/portraits/men/29.jpg',

  // Ginecologistas
  'dra-elena-castro': 'https://randomuser.me/api/portraits/women/39.jpg',
  'dra-renata-souza': 'https://randomuser.me/api/portraits/women/47.jpg',

  // Psiquiatras
  'dr-antonio-vieira': 'https://randomuser.me/api/portraits/men/52.jpg',
  'dra-claudia-ribeiro': 'https://randomuser.me/api/portraits/women/33.jpg',

  // Endocrinologistas
  'dra-melissa-nogueira': 'https://randomuser.me/api/portraits/women/30.jpg',
  'dr-felipe-garcia': 'https://randomuser.me/api/portraits/men/41.jpg',
};

// URLs de imagens para pacientes
export const PATIENT_IMAGES = {
  // Pacientes do sexo masculino
  'joao-paciente': 'https://randomuser.me/api/portraits/men/15.jpg',
  'carlos-paciente': 'https://randomuser.me/api/portraits/men/25.jpg',
  'pedro-paciente': 'https://randomuser.me/api/portraits/men/35.jpg',
  'lucas-paciente': 'https://randomuser.me/api/portraits/men/12.jpg',
  'mateus-paciente': 'https://randomuser.me/api/portraits/men/18.jpg',
  'gabriel-paciente': 'https://randomuser.me/api/portraits/men/21.jpg',
  'bruno-paciente': 'https://randomuser.me/api/portraits/men/27.jpg',
  'diego-paciente': 'https://randomuser.me/api/portraits/men/33.jpg',
  'tiago-paciente': 'https://randomuser.me/api/portraits/men/39.jpg',
  'rafael-paciente': 'https://randomuser.me/api/portraits/men/43.jpg',

  // Pacientes do sexo feminino
  'maria-paciente': 'https://randomuser.me/api/portraits/women/15.jpg',
  'ana-paciente': 'https://randomuser.me/api/portraits/women/25.jpg',
  'julia-paciente': 'https://randomuser.me/api/portraits/women/35.jpg',
  'beatriz-paciente': 'https://randomuser.me/api/portraits/women/12.jpg',
  'camila-paciente': 'https://randomuser.me/api/portraits/women/18.jpg',
  'luana-paciente': 'https://randomuser.me/api/portraits/women/21.jpg',
  'vitoria-paciente': 'https://randomuser.me/api/portraits/women/27.jpg',
  'isabella-paciente': 'https://randomuser.me/api/portraits/women/33.jpg',
  'larissa-paciente': 'https://randomuser.me/api/portraits/women/39.jpg',
  'mariana-paciente': 'https://randomuser.me/api/portraits/women/43.jpg',
};

// Imagem padrão para quando não houver imagem específica
export const DEFAULT_IMAGES = {
  doctor: 'https://randomuser.me/api/portraits/lego/0.jpg',
  patient: 'https://randomuser.me/api/portraits/lego/1.jpg',
  user: 'https://randomuser.me/api/portraits/lego/2.jpg',
};

/**
 * Obtém a URL da imagem do médico baseado no nome ou ID
 * @param doctorId ou nome do médico
 * @returns URL da imagem do médico
 */
export const getDoctorImage = (doctorId: string): string => {
  const normalizedId = doctorId.toLowerCase().trim();
  return DOCTOR_IMAGES[normalizedId] || DEFAULT_IMAGES.doctor;
};

/**
 * Obtém a URL da imagem do paciente baseado no nome ou ID
 * @param patientId ou nome do paciente
 * @returns URL da imagem do paciente
 */
export const getPatientImage = (patientId: string): string => {
  const normalizedId = patientId.toLowerCase().trim();
  return PATIENT_IMAGES[normalizedId] || DEFAULT_IMAGES.patient;
};

/**
 * Obtém uma imagem aleatória para um novo médico
 * @returns URL da imagem aleatória
 */
export const getRandomDoctorImage = (): string => {
  const doctorImages = Object.values(DOCTOR_IMAGES);
  const randomIndex = Math.floor(Math.random() * doctorImages.length);
  return doctorImages[randomIndex];
};

/**
 * Obtém uma imagem aleatória para um novo paciente
 * @returns URL da imagem aleatória
 */
export const getRandomPatientImage = (): string => {
  const patientImages = Object.values(PATIENT_IMAGES);
  const randomIndex = Math.floor(Math.random() * patientImages.length);
  return patientImages[randomIndex];
};

/**
 * Gera um ID para imagem baseado no nome
 * @param name Nome da pessoa
 * @param type 'doctor' ou 'patient'
 * @returns ID formatado para imagem
 */
export const generateImageId = (name: string, type: 'doctor' | 'patient'): string => {
  const normalizedName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return type === 'doctor' ? `dr-${normalizedName}` : `${normalizedName}-paciente`;
};

/**
 * Obtém a imagem apropriada baseada no nome e tipo
 * @param name Nome da pessoa
 * @param type 'doctor' ou 'patient'
 * @returns URL da imagem
 */
export const getProfileImage = (name: string, type: 'doctor' | 'patient'): string => {
  const imageId = generateImageId(name, type);
  return type === 'doctor' ? getDoctorImage(imageId) : getPatientImage(imageId);
};