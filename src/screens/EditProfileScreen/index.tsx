import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import ProfileImagePicker from '../../components/ProfileImagePicker';
import { imageService } from '../../services/imageService';
import { updateProfile } from './services/profileService';
import {
  Container,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  ProfileCard,
  ProfileImageContainer,
  RoleBadge,
  RoleText,
  FormCard,
  InputContainer,
  InputLabel,
  InputLabelText,
  StyledInput,
  ButtonsContainer,
  SaveButton,
  SaveButtonText,
  CancelButton,
  CancelButtonText,
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

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return props => props.theme.colors.primary;
      case 'doctor':
        return props => props.theme.colors.success;
      case 'patient':
        return props => props.theme.colors.secondary;
      default:
        return props => props.theme.colors.textMuted;
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Editar Perfil</HeaderTitle>
        <HeaderSubtitle>Atualize suas informações pessoais</HeaderSubtitle>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileCard>
          <ProfileImageContainer>
            <ProfileImagePicker
              currentImageUri={profileImage}
              onImageSelected={handleImageSelected}
              size={120}
              editable={true}
            />
          </ProfileImageContainer>

          <RoleBadge role={user?.role || ''}>
            <Ionicons
              name={
                user?.role === 'admin' ? 'shield' :
                user?.role === 'doctor' ? 'medical' : 'person'
              }
              size={16}
              color="#fff"
            />
            <RoleText>{getRoleText(user?.role || '')}</RoleText>
          </RoleBadge>
        </ProfileCard>

        <FormCard>
          <InputContainer>
            <InputLabel>
              <Ionicons name="person" size={16} color="#0066CC" />
              <InputLabelText>Nome Completo</InputLabel>
            </InputLabel>
            <StyledInput
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#999"
            />
          </InputContainer>

          <InputContainer>
            <InputLabel>
              <Ionicons name="mail" size={16} color="#0066CC" />
              <InputLabelText>Email</InputLabel>
            </InputLabel>
            <StyledInput
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </InputContainer>

          {user?.role === 'doctor' && (
            <InputContainer>
              <InputLabel>
                <Ionicons name="medical" size={16} color="#0066CC" />
                <InputLabelText>Especialidade</InputLabel>
              </InputLabel>
              <StyledInput
                value={specialty}
                onChangeText={setSpecialty}
                placeholder="Digite sua especialidade"
                placeholderTextColor="#999"
              />
            </InputContainer>
          )}
        </FormCard>

        <ButtonsContainer>
          <SaveButton onPress={handleSaveProfile} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <SaveButtonText>Salvar Alterações</SaveButtonText>
              </>
            )}
          </SaveButton>

          <CancelButton onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color="#0066CC" />
            <CancelButtonText>Cancelar</CancelButtonText>
          </CancelButton>
        </ButtonsContainer>
      </ScrollView>
    </Container>
  );
};

export default EditProfileScreen;