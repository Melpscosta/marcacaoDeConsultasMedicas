import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import ProfileImagePicker from '../../components/ProfileImagePicker';
import {
  Container,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  ProfileCard,
  ProfileImageContainer,
  Name,
  Email,
  RoleBadge,
  RoleText,
  SpecialtyText,
  ButtonsContainer,
  EditButton,
  BackButton,
  LogoutButton,
  ButtonText,
  styles
} from './styles';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

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

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Saída',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut }
      ]
    );
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Meu Perfil</HeaderTitle>
        <HeaderSubtitle>Gerencie suas informações pessoais</HeaderSubtitle>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileCard>
          <ProfileImageContainer>
            <ProfileImagePicker
              currentImageUri={user?.image}
              onImageSelected={() => {}} // Read-only na tela de perfil
              size={120}
              editable={false}
            />
          </ProfileImageContainer>
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
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

          {user?.role === 'doctor' && (
            <SpecialtyText>Especialidade: {user?.specialty}</SpecialtyText>
          )}
        </ProfileCard>

        <ButtonsContainer>
          <EditButton onPress={() => navigation.navigate('EditProfile' as any)}>
            <Ionicons name="create" size={20} color="#fff" />
            <ButtonText>Editar Perfil</ButtonText>
          </EditButton>

          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#0066CC" />
            <ButtonText>Voltar</ButtonText>
          </BackButton>

          <LogoutButton onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#fff" />
            <ButtonText>Sair</ButtonText>
          </LogoutButton>
        </ButtonsContainer>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;