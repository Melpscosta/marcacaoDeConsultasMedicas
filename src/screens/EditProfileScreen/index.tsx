import React, { useState } from 'react';
import { ScrollView, ViewStyle, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import Header from '../../components/Header';
import ProfileImagePicker from '../../components/ProfileImagePicker';
import { imageService } from '../../services/imageService';
import { updateProfile } from './services/profileService';
import {
  Container,
  Title,
  ProfileCard,
  RoleBadge,
  RoleText,
  styles
} from './styles';

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const EditProfileScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation<EditProfileScreenProps['navigation']>();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [profileImage, setProfileImage] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);

  const handleImageSelected = async (imageUri: string) => {
    try {
      setProfileImage(imageUri);

      // Salva a imagem no armazenamento local se for uma nova imagem
      if (imageUri.startsWith('data:image/') && user?.id) {
        const savedImageUri = await imageService.saveProfileImage(user.id, {
          uri: imageUri,
          base64: imageUri.split(',')[1],
          width: 150,
          height: 150,
        });
        setProfileImage(savedImageUri);
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      Alert.alert('Erro', 'Não foi possível processar a imagem selecionada');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const updatedUser = await updateProfile(user, name, email, specialty, profileImage);

      // Atualiza no Context
      await updateUser(updatedUser);

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Perfil</Title>

        <ProfileCard>
          <ProfileImagePicker
            currentImageUri={profileImage}
            onImageSelected={handleImageSelected}
            size={120}
            editable={true}
          />

          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            placeholder="Digite seu nome"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {user?.role === 'doctor' && (
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={styles.input}
              placeholder="Digite sua especialidade"
            />
          )}

          <RoleBadge role={user?.role || ''}>
            <RoleText>{user?.role === 'admin' ? 'Administrador' : user?.role === 'doctor' ? 'Médico' : 'Paciente'}</RoleText>
          </RoleBadge>
        </ProfileCard>

        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

export default EditProfileScreen;