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
import { statisticsService, Statistics } from '../services/statistics';
import AppointmentActionModal from '../components/AppointmentActionModal';
import { notificationService } from '../services/notifications';
import { StatusBadge } from '../components/FeedbackMessages';

type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface StyledProps {
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

const DoctorDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Partial<Statistics> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctorId === user?.id
        );
        setAppointments(doctorAppointments);

        if (user) {
          const stats = await statisticsService.getDoctorStatistics(user.id);
          setStatistics(stats);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

const handleOpenModal = (appointment: Appointment, action: 'confirm' | 'cancel') => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!selectedAppointment) return;

    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.map(appointment => {
          if (appointment.id === selectedAppointment.id) {
            return { 
              ...appointment, 
              status: actionType === 'confirm' ? 'confirmed' : 'cancelled',
              ...(reason && { cancelReason: reason })
            };
          }
          return appointment;
        });
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));

        // Envia notificação para o paciente
        if (actionType === 'confirm') {
          await notificationService.notifyAppointmentConfirmed(
            selectedAppointment.patientId,
            selectedAppointment
          );
        } else {
          await notificationService.notifyAppointmentCancelled(
            selectedAppointment.patientId,
            selectedAppointment,
            reason
          );
        }

        loadAppointments(); // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Carrega as consultas quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <AppointmentCard>
      <AppointmentHeader>
        <PatientInfo>
          <PatientName>{item.patientName || 'Nome não disponível'}</PatientName>
          <AppointmentDateTime>
            <Ionicons name="calendar" size={16} color={theme.colors.textMuted} />
            <DateTimeText>{item.date}</DateTimeText>
          </AppointmentDateTime>
          <AppointmentDateTime>
            <Ionicons name="clock" size={16} color={theme.colors.textMuted} />
            <DateTimeText>{item.time}</DateTimeText>
          </AppointmentDateTime>
        </PatientInfo>
        <StatusBadge status={item.status} />
      </AppointmentHeader>

      <SpecialtyTag>
        <Ionicons name="medical" size={14} color={theme.colors.primary} />
        <SpecialtyText>{item.specialty}</SpecialtyText>
      </SpecialtyTag>

      {item.status === 'pending' && (
        <ActionButtonsContainer>
          <ConfirmButton onPress={() => handleOpenModal(item, 'confirm')}>
            <Ionicons name="checkmark" size={16} color="#fff" />
            <ButtonText>Confirmar</ButtonText>
          </ConfirmButton>
          <CancelButton onPress={() => handleOpenModal(item, 'cancel')}>
            <Ionicons name="close" size={16} color="#fff" />
            <ButtonText>Cancelar</ButtonText>
          </CancelButton>
        </ActionButtonsContainer>
      )}
    </AppointmentCard>
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Painel Médico</HeaderTitle>
        <HeaderSubtitle>Bem-vindo(a), Dr(a). {user?.name}</HeaderSubtitle>
      </Header>

      <Content>
        <ActionsContainer>
          <ActionButton onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={24} color="#fff" />
            <ActionText>Meu Perfil</ActionText>
          </ActionButton>

          <ActionButton onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color="#fff" />
            <ActionText>Configurações</ActionText>
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
                <StatisticsSubtitle>{`${statistics.statusPercentages.confirmed?.toFixed(1) || 0}% do total`}</StatisticsSubtitle>
              </StatisticsContent>
            </StatisticsCard>

            <StatisticsCard>
              <StatisticsIcon background={theme.colors.errorLight}>
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </StatisticsIcon>
              <StatisticsContent>
                <StatisticsValue>{statistics.cancelledAppointments}</StatisticsValue>
                <StatisticsLabel>Canceladas</StatisticsLabel>
                <StatisticsSubtitle>{`${statistics.statusPercentages.cancelled?.toFixed(1) || 0}% do total`}</StatisticsSubtitle>
              </StatisticsContent>
            </StatisticsCard>
          </StatisticsGrid>
        )}

        <SectionTitle>Minhas Consultas</SectionTitle>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <LoadingText>Carregando consultas...</LoadingText>
          </LoadingContainer>
        ) : appointments.length === 0 ? (
          <EmptyContainer>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textMuted} />
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          </EmptyContainer>
        ) : (
          <AppointmentList
            data={appointments}
            renderItem={renderAppointmentItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        <LogoutButton onPress={signOut}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <LogoutText>Sair</LogoutText>
        </LogoutButton>

        {selectedAppointment && (
          <AppointmentActionModal
            visible={modalVisible}
            onClose={handleCloseModal}
            onConfirm={handleConfirmAction}
            actionType={actionType}
            appointmentDetails={{
              patientName: selectedAppointment.patientName,
              doctorName: selectedAppointment.doctorName,
              date: selectedAppointment.date,
              time: selectedAppointment.time,
              specialty: selectedAppointment.specialty,
            }}
          />
        )}
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

const ActionsContainer = styled.View`
  flex-direction: row;
  gap: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
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

const AppointmentList = styled.FlatList`
  flex: 1;
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

const PatientInfo = styled.View`
  flex: 1;
`;

const PatientName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const AppointmentDateTime = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const DateTimeText = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const SpecialtyTag = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primaryLight};
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.borderRadius.sm}px;
  align-self: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const SpecialtyText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
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
  font-size: ${props => props.theme.typography.small.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

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

export default DoctorDashboardScreen; 