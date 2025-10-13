import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { statisticsService, Statistics } from '../services/statistics';
import { StatusBadge } from '../components/FeedbackMessages';
import theme from '../styles/theme';

type AdminDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

const AdminDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<AdminDashboardScreenProps['navigation']>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const loadData = async () => {
    try {
      // Carrega consultas
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        setAppointments(allAppointments);
      }

      const stats = await statisticsService.getGeneralStatistics();
      setStatistics(stats);

      // Carrega usuários
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        setUsers(allUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.map(appointment => {
          if (appointment.id === appointmentId) {
            return { ...appointment, status: newStatus };
          }
          return appointment;
        });
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
        loadData(); // Recarrega os dados
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Painel Administrativo</HeaderTitle>
        <HeaderSubtitle>Bem-vindo(a), {user?.name}</HeaderSubtitle>
      </Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <ActionsContainer>
          <ActionButton
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Ionicons name="people" size={24} color={theme.colors.white} />
            <ActionText>Gerenciar Usuários</ActionText>
          </ActionButton>

          <ActionButton
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={24} color={theme.colors.white} />
            <ActionText>Meu Perfil</ActionText>
          </ActionButton>
        </ActionsContainer>

        <SectionTitle>Estatísticas Gerais</SectionTitle>
        {statistics && (
          <StatisticsGrid>
            <StatisticsCard>
              <StatisticsIcon background={theme.colors.primaryLight}>
                <Ionicons name="calendar" size={24} color={theme.colors.primary} />
              </StatisticsIcon>
              <StatisticsContent>
                <StatisticsValue>{statistics.totalAppointments}</StatisticsValue>
                <StatisticsLabel>Total de Consultas</StatisticsLabel>
                <StatisticsSubtitle>Todas as consultas</StatisticsSubtitle>
              </StatisticsContent>
            </StatisticsCard>

            <StatisticsCard>
              <StatisticsIcon background={theme.colors.successLight}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              </StatisticsIcon>
              <StatisticsContent>
                <StatisticsValue>{statistics.confirmedAppointments}</StatisticsValue>
                <StatisticsLabel>Confirmadas</StatisticsLabel>
                <StatisticsSubtitle>{`${statistics.statusPercentages.confirmed.toFixed(1)}% do total`}</StatisticsSubtitle>
              </StatisticsContent>
            </StatisticsCard>

            <StatisticsCard>
              <StatisticsIcon background={theme.colors.secondaryLight}>
                <Ionicons name="people" size={24} color={theme.colors.secondary} />
              </StatisticsIcon>
              <StatisticsContent>
                <StatisticsValue>{statistics.totalPatients}</StatisticsValue>
                <StatisticsLabel>Pacientes Ativos</StatisticsLabel>
                <StatisticsSubtitle>Pacientes únicos</StatisticsSubtitle>
              </StatisticsContent>
            </StatisticsCard>

            <StatisticsCard>
              <StatisticsIcon background={theme.colors.warningLight}>
                <Ionicons name="medical" size={24} color={theme.colors.warning} />
              </StatisticsIcon>
              <StatisticsContent>
                <StatisticsValue>{statistics.totalDoctors}</StatisticsValue>
                <StatisticsLabel>Médicos Ativos</StatisticsLabel>
                <StatisticsSubtitle>Médicos com consultas</StatisticsSubtitle>
              </StatisticsContent>
            </StatisticsCard>
          </StatisticsGrid>
        )}

        <SectionTitle>Especialidades Mais Procuradas</SectionTitle>
        {statistics && Object.entries(statistics.specialties).length > 0 && (
          <SpecialtyContainer>
            {Object.entries(statistics.specialties)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([specialty, count]) => (
                <SpecialtyItem key={specialty}>
                  <SpecialtyInfo>
                    <SpecialtyName>{specialty}</SpecialtyName>
                    <SpecialtyCount>{count} consultas</SpecialtyCount>
                  </SpecialtyInfo>
                  <SpecialtyIcon>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                  </SpecialtyIcon>
                </SpecialtyItem>
              ))
            }
          </SpecialtyContainer>
        )}

        <SectionTitle>Últimas Consultas</SectionTitle>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <LoadingText>Carregando dados...</LoadingText>
          </LoadingContainer>
        ) : appointments.length === 0 ? (
          <EmptyContainer>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textMuted} />
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          </EmptyContainer>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <AppointmentHeader>
                <DoctorInfo>
                  <DoctorName>{appointment.doctorName}</DoctorName>
                  <DoctorSpecialty>{appointment.specialty}</DoctorSpecialty>
                </DoctorInfo>
                <StatusBadge status={appointment.status} />
              </AppointmentHeader>

              <AppointmentDetails>
                <DetailRow>
                  <Ionicons name="calendar" size={16} color={theme.colors.textMuted} />
                  <DetailText>{appointment.date}</DetailText>
                </DetailRow>
                <DetailRow>
                  <Ionicons name="clock" size={16} color={theme.colors.textMuted} />
                  <DetailText>{appointment.time}</DetailText>
                </DetailRow>
              </AppointmentDetails>

              {appointment.status === 'pending' && (
                <ActionButtonsContainer>
                  <ConfirmButton onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}>
                    <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                    <ButtonText>Confirmar</ButtonText>
                  </ConfirmButton>
                  <CancelButton onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}>
                    <Ionicons name="close" size={16} color={theme.colors.white} />
                    <ButtonText>Cancelar</ButtonText>
                  </CancelButton>
                </ActionButtonsContainer>
              )}
            </AppointmentCard>
          ))
        )}

        <LogoutButton onPress={signOut}>
          <Ionicons name="log-out" size={24} color={theme.colors.white} />
          <LogoutText>Sair</LogoutText>
        </LogoutButton>
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: theme.spacing.lg,
  },
};

// Container principal
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

// Header
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

// Ações principais
const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  gap: ${props => props.theme.spacing.md}px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  align-items: center;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ActionText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-top: ${props => props.theme.spacing.sm}px;
`;

// Seção de estatísticas
const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const StatisticsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  gap: ${props => props.theme.spacing.md}px;
`;

const StatisticsCard = styled.View`
  flex: 1;
  min-width: 45%;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatisticsIcon = styled.View<{ background: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg}px;
  background-color: ${props => props.background};
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const StatisticsContent = styled.View`
  flex: 1;
`;

const StatisticsValue = styled.Text`
  font-size: ${props => props.theme.typography.heading.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const StatisticsLabel = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const StatisticsSubtitle = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

// Especialidades
const SpecialtyContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SpecialtyItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border}20;

  &:last-child {
    border-bottom-width: 0;
  }
`;

const SpecialtyInfo = styled.View`
  flex: 1;
`;

const SpecialtyName = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const SpecialtyCount = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const SpecialtyIcon = styled.View``;

// Consultas
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

const AppointmentCard = styled.View`
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

const AppointmentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const DoctorInfo = styled.View`
  flex: 1;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const DoctorName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const DoctorSpecialty = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

const AppointmentDetails = styled.View`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailText = styled.Text`
  flex: 1;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.sm}px;
`;

const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

// Botão de logout
const LogoutButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.error};
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

const LogoutText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export default AdminDashboardScreen; 