import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth';

type UserManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
};

const UserManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<UserManagementScreenProps['navigation']>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      // Carrega todos os usuários do authService
      const allUsers = await authService.getAllUsers();
      // Filtra o usuário atual da lista
      const filteredUsers = allUsers.filter(u => u.id !== user?.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Implementação futura para deletar usuário
    console.log('Deletar usuário:', userId);
  };

  // Carrega os usuários quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return 'shield';
      case 'doctor':
        return 'medical';
      case 'patient':
        return 'person';
      default:
        return 'help';
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <UserCard>
      <UserHeader>
        <UserAvatar>
          <Ionicons
            name={getRoleIcon(item.role)}
            size={24}
            color="#fff"
          />
        </UserAvatar>
        <UserInfo>
          <UserName>{item.name}</UserName>
          <UserEmail>{item.email}</UserEmail>
        </UserInfo>
        <RoleBadge role={item.role}>
          <RoleText role={item.role}>
            {getRoleText(item.role)}
          </RoleText>
        </RoleBadge>
      </UserHeader>

      <UserActions>
        <ActionButton onPress={() => {}}>
          <Ionicons name="create" size={16} color="#fff" />
          <ActionText>Editar</ActionText>
        </ActionButton>
        <DeleteButton onPress={() => handleDeleteUser(item.id)}>
          <Ionicons name="trash" size={16} color="#fff" />
          <ActionText>Excluir</ActionText>
        </DeleteButton>
      </UserActions>
    </UserCard>
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Gerenciar Usuários</HeaderTitle>
        <HeaderSubtitle>Administre todos os usuários do sistema</HeaderSubtitle>
      </Header>

      <Content>
        <AddUserButton onPress={() => {}}>
          <Ionicons name="add" size={24} color="#fff" />
          <AddUserText>Adicionar Novo Usuário</AddUserText>
        </AddUserButton>

        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <LoadingText>Carregando usuários...</LoadingText>
          </LoadingContainer>
        ) : users.length === 0 ? (
          <EmptyContainer>
            <Ionicons name="people" size={64} color={theme.colors.textMuted} />
            <EmptyText>Nenhum usuário cadastrado</EmptyText>
          </EmptyContainer>
        ) : (
          <UserList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <BackText>Voltar</BackText>
        </BackButton>
      </Content>
    </Container>
  );
};

// Componentes estilizados
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  background-color: ${props => props.theme.colors.primary};
  padding-horizontal: ${props => props.theme.spacing.lg}px;
  padding-vertical: ${props => props.theme.spacing.lg}px;
  padding-top: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

const HeaderTitle = styled.Text`
  font-size: ${props => props.theme.typography.heading.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.fontWeight};
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const HeaderSubtitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.white};
  opacity: 0.9;
  text-align: center;
`;

const Content = styled.View`
  flex: 1;
  padding: ${props => props.theme.spacing.lg}px;
`;

const AddUserButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const AddUserText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const EmptyText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const UserList = styled.FlatList`
  flex: 1;
`;

const UserCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.theme.colors.border};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const UserHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const UserAvatar = styled.View<{ role: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg}px;
  background-color: ${props => {
    switch (props.role) {
      case 'admin':
        return props.theme.colors.primary;
      case 'doctor':
        return props.theme.colors.success;
      case 'patient':
        return props.theme.colors.secondary;
      default:
        return props.theme.colors.textMuted;
    }
  }};
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const UserEmail = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

const RoleBadge = styled.View<{ role: string }>`
  background-color: ${props => {
    switch (props.role) {
      case 'admin':
        return props.theme.colors.primary + '20';
      case 'doctor':
        return props.theme.colors.success + '20';
      case 'patient':
        return props.theme.colors.secondary + '20';
      default:
        return props.theme.colors.textMuted + '20';
    }
  }};
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.borderRadius.sm}px;
  align-items: center;
  justify-content: center;
`;

const RoleText = styled.Text<{ role: string }>`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  font-weight: 600;
  color: ${props => {
    switch (props.role) {
      case 'admin':
        return props.theme.colors.primary;
      case 'doctor':
        return props.theme.colors.success;
      case 'patient':
        return props.theme.colors.secondary;
      default:
        return props.theme.colors.textMuted;
    }
  }};
`;

const UserActions = styled.View`
  flex-direction: row;
  gap: ${props => props.theme.spacing.sm}px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DeleteButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ActionText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.small.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const BackButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const BackText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export default UserManagementScreen; 