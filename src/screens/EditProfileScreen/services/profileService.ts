import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageService } from '../../../services/imageService';

export const updateProfile = async (
  user: any,
  name: string,
  email: string,
  specialty: string,
  profileImage: string
) => {
  if (!name.trim() || !email.trim()) {
    throw new Error('Nome e email são obrigatórios');
  }

  const updatedUser = {
    ...user,
    name: name.trim(),
    email: email.trim(),
    image: profileImage,
    ...(user.role === 'doctor' && { specialty: specialty.trim() }),
  };

  // Salva no AsyncStorage
  await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));

  // Limpeza de imagens antigas
  if (user.id) {
    await imageService.cleanupOldImages(user.id);
  }

  return updatedUser;
};